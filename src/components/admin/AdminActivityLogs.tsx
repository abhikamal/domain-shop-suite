import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, ChevronDown, ChevronRight, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityLog {
  id: string;
  user_id: string;
  activity_type: string;
  activity_description: string | null;
  ip_address: string | null;
  user_agent: string | null;
  metadata: unknown;
  created_at: string;
  profiles?: {
    full_name: string;
    username: string | null;
    email: string;
  } | null;
}

interface AdminActivityLogsProps {
  isSuperAdmin: boolean;
}

const AdminActivityLogs: React.FC<AdminActivityLogsProps> = ({ isSuperAdmin }) => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'simple' | 'detailed'>('simple');
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (isSuperAdmin) {
      fetchLogs();
    }
  }, [isSuperAdmin]);

  const fetchLogs = async () => {
    setLoading(true);
    const { data: logsData, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(500);

    if (error) {
      console.error('Error fetching logs:', error);
      setLoading(false);
      return;
    }

    if (logsData) {
      // Fetch profiles separately
      const userIds = [...new Set(logsData.map(log => log.user_id))];
      const { data: profiles } = await supabase
        .from('profiles')
        .select('user_id, full_name, username, email')
        .in('user_id', userIds);

      const profilesMap = new Map(profiles?.map(p => [p.user_id, p]) || []);
      const logsWithProfiles = logsData.map(log => ({
        ...log,
        profiles: profilesMap.get(log.user_id) || null
      }));
      setLogs(logsWithProfiles);
    }
    setLoading(false);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const getActivityBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      login: 'bg-green-500/20 text-green-600',
      logout: 'bg-gray-500/20 text-gray-600',
      signup: 'bg-blue-500/20 text-blue-600',
      view_product: 'bg-purple-500/20 text-purple-600',
      add_to_cart: 'bg-orange-500/20 text-orange-600',
      place_order: 'bg-emerald-500/20 text-emerald-600',
      update_profile: 'bg-yellow-500/20 text-yellow-600',
      sell_product: 'bg-pink-500/20 text-pink-600',
      admin_action: 'bg-red-500/20 text-red-600'
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.profiles?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      log.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      log.user_id.toLowerCase().includes(search.toLowerCase()) ||
      log.activity_description?.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = activityFilter === 'all' || log.activity_type === activityFilter;
    
    return matchesSearch && matchesFilter;
  });

  const activityTypes = [...new Set(logs.map(log => log.activity_type))];

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-muted-foreground">Access denied. Super Admin privileges required.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="flex items-center gap-2">
            Activity Logs
            <Badge variant="secondary">{filteredLogs.length} entries</Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'simple' ? 'detailed' : 'simple')}
            >
              {viewMode === 'simple' ? <Eye className="h-4 w-4 mr-1" /> : <EyeOff className="h-4 w-4 mr-1" />}
              {viewMode === 'simple' ? 'Detailed' : 'Simple'}
            </Button>
            <Button variant="outline" size="sm" onClick={fetchLogs} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by user, email, or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by activity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              {activityTypes.map(type => (
                <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="h-[600px]">
          <Table>
            <TableHeader>
              <TableRow>
                {viewMode === 'detailed' && <TableHead className="w-8"></TableHead>}
                <TableHead>User</TableHead>
                <TableHead>Activity</TableHead>
                <TableHead>Time</TableHead>
                {viewMode === 'detailed' && <TableHead>IP Address</TableHead>}
                <TableHead>Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={viewMode === 'detailed' ? 6 : 4} className="text-center py-8">
                    Loading logs...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={viewMode === 'detailed' ? 6 : 4} className="text-center py-8">
                    No activity logs found
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <React.Fragment key={log.id}>
                    <TableRow className="hover:bg-muted/50">
                      {viewMode === 'detailed' && (
                        <TableCell>
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(log.id)}
                              >
                                {expandedRows.has(log.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </Button>
                            </CollapsibleTrigger>
                          </Collapsible>
                        </TableCell>
                      )}
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">{log.profiles?.full_name || 'Unknown'}</span>
                          {viewMode === 'detailed' && (
                            <span className="text-xs text-muted-foreground truncate max-w-32">
                              {log.user_id}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getActivityBadgeColor(log.activity_type)}>
                          {log.activity_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span>{format(new Date(log.created_at), 'MMM d, yyyy')}</span>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), 'h:mm:ss a')}
                          </span>
                        </div>
                      </TableCell>
                      {viewMode === 'detailed' && (
                        <TableCell className="font-mono text-sm">
                          {log.ip_address || 'N/A'}
                        </TableCell>
                      )}
                      <TableCell className="max-w-xs truncate">
                        {log.activity_description || '-'}
                      </TableCell>
                    </TableRow>
                    {viewMode === 'detailed' && expandedRows.has(log.id) && (
                      <TableRow>
                        <TableCell colSpan={6} className="bg-muted/30 p-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>User ID:</strong>
                              <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                                {log.user_id}
                              </pre>
                            </div>
                            <div>
                              <strong>Email:</strong>
                              <p className="text-muted-foreground">{log.profiles?.email || 'N/A'}</p>
                            </div>
                            <div className="md:col-span-2">
                              <strong>User Agent:</strong>
                              <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                                {log.user_agent || 'N/A'}
                              </pre>
                            </div>
                            {Object.keys(log.metadata || {}).length > 0 && (
                              <div className="md:col-span-2">
                                <strong>Metadata:</strong>
                                <pre className="text-xs bg-background p-2 rounded mt-1 overflow-x-auto">
                                  {JSON.stringify(log.metadata, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default AdminActivityLogs;
