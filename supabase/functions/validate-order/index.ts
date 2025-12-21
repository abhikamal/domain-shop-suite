import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    // Get user from auth header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      console.error("No authorization header");
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const supabaseClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    // Get user
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error("Auth error:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { 
      product_id, 
      quantity = 1, 
      shipping_address = null,
      buyer_phone = null,
      payment_method = 'cod'
    } = await req.json();
    
    console.log(`Validating order - User: ${user.id}, Product: ${product_id}, Quantity: ${quantity}, Payment: ${payment_method}`);

    // Validate quantity - single unit only
    if (!Number.isInteger(quantity) || quantity !== 1) {
      console.error("Invalid quantity:", quantity);
      return new Response(
        JSON.stringify({ error: "Each product is single unit only. Quantity must be 1." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate payment method
    const validPaymentMethods = ['cod', 'online'];
    if (!validPaymentMethods.includes(payment_method)) {
      console.error("Invalid payment method:", payment_method);
      return new Response(
        JSON.stringify({ error: "Invalid payment method" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Fetch current product price from database (server-side validation)
    const { data: product, error: productError } = await supabaseAdmin
      .from("products")
      .select("id, price, is_available, seller_id, name")
      .eq("id", product_id)
      .single();

    if (productError || !product) {
      console.error("Product not found:", productError);
      return new Response(
        JSON.stringify({ error: "Product not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!product.is_available) {
      console.error("Product not available:", product_id);
      return new Response(
        JSON.stringify({ error: "Product is no longer available" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prevent buying own product
    if (product.seller_id === user.id) {
      console.error("User tried to buy own product");
      return new Response(
        JSON.stringify({ error: "You cannot purchase your own product" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check for existing active orders for this product (pending, confirmed, shipped)
    // Only cancelled and delivered orders allow repurchase
    const { data: existingOrders, error: existingOrdersError } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("product_id", product_id)
      .in("status", ["pending", "confirmed", "shipped"]);

    if (existingOrdersError) {
      console.error("Error checking existing orders:", existingOrdersError);
      return new Response(
        JSON.stringify({ error: "Failed to validate order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (existingOrders && existingOrders.length > 0) {
      console.log("Product has active orders:", existingOrders);
      return new Response(
        JSON.stringify({ error: "This product already has an active order. It can only be purchased after the current order is cancelled or delivered." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Calculate total server-side with validated price
    const total_amount = product.price * quantity;
    console.log(`Calculated total: ${total_amount} (price: ${product.price} x quantity: ${quantity})`);

    // Mark product as unavailable when creating order
    const { error: updateProductError } = await supabaseAdmin
      .from("products")
      .update({ is_available: false })
      .eq("id", product_id);

    if (updateProductError) {
      console.error("Failed to update product availability:", updateProductError);
    }

    // Create order with validated data using admin client
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert({
        buyer_id: user.id,
        product_id: product.id,
        seller_id: product.seller_id,
        total_amount,
        status: "pending",
        shipping_address,
        buyer_phone,
        payment_method,
      })
      .select()
      .single();

    if (orderError) {
      console.error("Order creation failed:", orderError);
      // Revert product availability if order fails
      await supabaseAdmin
        .from("products")
        .update({ is_available: true })
        .eq("id", product_id);
      
      return new Response(
        JSON.stringify({ error: "Failed to create order" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Order created successfully: ${order.id}, Receipt: ${order.receipt_number}`);

    return new Response(
      JSON.stringify({ 
        order,
        product_name: product.name,
        validated_price: product.price,
        validated_total: total_amount,
        receipt_number: order.receipt_number
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});