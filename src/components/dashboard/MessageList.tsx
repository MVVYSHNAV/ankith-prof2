import { useContactMessages } from "@/hooks/useSupabase";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Mail, User, Clock, MessageSquareText } from "lucide-react";

const MessageList = () => {
    const { data: messages, isLoading } = useContactMessages();

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin" /></div>;
    }

    if (!messages || messages.length === 0) {
        return (
            <Card className="bg-muted/30 border-border">
                <CardContent className="flex flex-col items-center justify-center p-12 text-muted-foreground">
                    <MessageSquareText size={48} strokeWidth={1} className="mb-4 opacity-20" />
                    <p className="font-body text-xs tracking-widest uppercase">No messages yet</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-muted/30 border-border overflow-hidden">
            <CardHeader>
                <CardTitle className="font-display uppercase tracking-tight text-xl">Inquiries</CardTitle>
                <CardDescription>Messages received from the contact form.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow className="border-border">
                                <TableHead className="w-[200px] text-xs uppercase tracking-widest font-body">Sender</TableHead>
                                <TableHead className="text-xs uppercase tracking-widest font-body">Message</TableHead>
                                <TableHead className="w-[150px] text-xs uppercase tracking-widest font-body">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {messages.map((msg) => (
                                <TableRow key={msg.id} className="border-border hover:bg-muted/20 transition-colors group">
                                    <TableCell className="align-top py-4">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2 font-display text-sm">
                                                <User size={12} className="text-accent" />
                                                {msg.name}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                                                <Mail size={10} />
                                                {msg.email}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <p className="text-sm font-body leading-relaxed whitespace-pre-wrap text-muted-foreground group-hover:text-foreground transition-colors max-w-lg">
                                            {msg.message}
                                        </p>
                                    </TableCell>
                                    <TableCell className="align-top py-4">
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-body uppercase">
                                            <Clock size={10} />
                                            {format(new Date(msg.created_at), "MMM d, yyyy")}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
};

export default MessageList;
