import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface TermsDialogProps {
  children: React.ReactNode;
}

const terms = [
  "Only currently enrolled students with valid college ID/email are allowed to register and use HyperMart.",
  "Users must provide accurate and up-to-date information at registration for verification purposes.",
  "HyperMart is a platform connecting student buyers and sellers; HyperMart is not the seller or buyer of any items.",
  "Users agree to use the platform only for legal, lawful transactions of campus-relevant goods.",
  "Sellers are responsible for ensuring the accuracy, authenticity, and condition of items listed.",
  "Buyers should confirm item condition before purchase. HyperMart does not guarantee item quality or condition.",
  "HyperMart may charge commission or fees on sales, listing boosts, or optional services, payable by the seller or buyer as agreed.",
  "All payments via HyperMart are subject to applicable taxes and GST as per Indian laws.",
  "Users shall not post illegal, dangerous, or prohibited items.",
  "Harassment, fraud, false listings, or abusive behavior will result in account suspension or legal action.",
  "User data is collected and used per the HyperMart Privacy Policy.",
  "Personal data shared during transactions will be protected and only used for platform operation.",
  "Any feedback or suggestions provided by users about HyperMart may be used royalty-free by the platform to improve the service.",
  "HyperMart provides tools for dispute reporting and mediation but does not directly resolve buyer-seller conflicts.",
  "Users must attempt resolution in good faith and may seek legal remedies independently.",
  "HyperMart is not liable for any damages, losses, or expenses arising from use of the platform or transactions conducted.",
  "The platform is provided \"as is\" without warranties of any kind.",
  "HyperMart reserves the right to suspend or terminate accounts violating terms without prior notice.",
  "HyperMart may update these Terms and Conditions at any time; continued use constitutes acceptance of changes.",
  "These Terms are governed by Indian law, and disputes shall be subject to jurisdiction in the city where HyperMart is headquartered or operates."
];

const TermsDialog = ({ children }: TermsDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-primary">
            HyperMart Terms and Conditions
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <ol className="space-y-4 list-decimal list-inside">
            {terms.map((term, index) => (
              <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                {term}
              </li>
            ))}
          </ol>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TermsDialog;
