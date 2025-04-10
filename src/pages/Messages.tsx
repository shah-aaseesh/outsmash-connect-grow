
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/components/Navbar";
import { toast } from "@/hooks/use-toast";

// Message type definition
type Message = {
  id: number;
  senderId: number;
  text: string;
  timestamp: Date;
};

// Contact type definition
type Contact = {
  id: number;
  name: string;
  username: string;
  avatar: string;
  lastSeen: string;
  online: boolean;
  unread: number;
};

const Messages = () => {
  // Mock current user ID
  const currentUserId = 1;
  
  // Mock contacts data
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 2, name: "Jordan Lee", username: "jordanl", avatar: "Jordan", lastSeen: "Just now", online: true, unread: 3 },
    { id: 3, name: "Morgan Taylor", username: "morgant", avatar: "Morgan", lastSeen: "5m ago", online: true, unread: 0 },
    { id: 4, name: "Casey Williams", username: "caseyw", avatar: "Casey", lastSeen: "1h ago", online: false, unread: 0 },
    { id: 5, name: "Riley Johnson", username: "rileyj", avatar: "Riley", lastSeen: "3h ago", online: false, unread: 0 },
  ]);
  
  // Mock conversation data
  const [conversations, setConversations] = useState<Record<number, Message[]>>({
    2: [
      { id: 1, senderId: 2, text: "Hey there! How's it going?", timestamp: new Date(Date.now() - 3600000 * 2) },
      { id: 2, senderId: 1, text: "Hi Jordan! I'm doing great, thanks for asking. How about you?", timestamp: new Date(Date.now() - 3600000 * 1.5) },
      { id: 3, senderId: 2, text: "Pretty good! Just working on that project we discussed last week.", timestamp: new Date(Date.now() - 3600000) },
      { id: 4, senderId: 2, text: "Have you had a chance to look at the documents I sent?", timestamp: new Date(Date.now() - 1800000) },
      { id: 5, senderId: 2, text: "Also, are we still meeting tomorrow?", timestamp: new Date(Date.now() - 900000) },
    ],
    3: [
      { id: 1, senderId: 1, text: "Hey Morgan, how are you?", timestamp: new Date(Date.now() - 86400000) },
      { id: 2, senderId: 3, text: "I'm good! Just saw your post about the new project.", timestamp: new Date(Date.now() - 82800000) },
    ],
    4: [
      { id: 1, senderId: 4, text: "Thanks for connecting!", timestamp: new Date(Date.now() - 172800000) },
    ],
    5: [],
  });
  
  // Current active contact
  const [activeContact, setActiveContact] = useState<number>(2);
  
  // New message input
  const [newMessage, setNewMessage] = useState<string>("");
  
  useEffect(() => {
    toast({
      title: "Messages",
      description: "Welcome to your messages.",
    });
  }, []);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const updatedConversations = { ...conversations };
    const newMsg: Message = {
      id: (conversations[activeContact]?.length || 0) + 1,
      senderId: currentUserId,
      text: newMessage,
      timestamp: new Date(),
    };
    
    updatedConversations[activeContact] = [...(updatedConversations[activeContact] || []), newMsg];
    setConversations(updatedConversations);
    setNewMessage("");
  };
  
  // Format timestamp for display
  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Handle switching active contact
  const handleContactSelect = (contactId: number) => {
    setActiveContact(contactId);
    
    // Mark messages as read
    const updatedContacts = contacts.map(contact => 
      contact.id === contactId ? { ...contact, unread: 0 } : contact
    );
    setContacts(updatedContacts);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="bg-gradient-to-b from-primary/20 via-background to-background">
        {/* Messages Header */}
        <header className="pt-20 pb-8 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold">Messages</h1>
            <p className="text-muted-foreground mt-2">
              Chat with your connections
            </p>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 pb-12">
          <Card className="h-[70vh]">
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Contacts List */}
              <div className="border-r">
                <div className="p-4">
                  <Input 
                    type="search" 
                    placeholder="Search messages..." 
                    className="w-full"
                  />
                </div>
                <Separator />
                <ScrollArea className="h-[calc(70vh-73px)]">
                  {contacts.map((contact) => (
                    <div 
                      key={contact.id}
                      className={`flex items-center gap-3 p-4 hover:bg-secondary/50 cursor-pointer ${activeContact === contact.id ? 'bg-secondary' : ''}`}
                      onClick={() => handleContactSelect(contact.id)}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contact.avatar}`} />
                          <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between">
                          <h3 className="font-medium truncate">{contact.name}</h3>
                          <span className="text-xs text-muted-foreground">{contact.lastSeen}</span>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversations[contact.id]?.length > 0 
                            ? conversations[contact.id][conversations[contact.id].length - 1].text 
                            : "No messages yet"}
                        </p>
                      </div>
                      {contact.unread > 0 && (
                        <div className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                          {contact.unread}
                        </div>
                      )}
                    </div>
                  ))}
                </ScrollArea>
              </div>
              
              {/* Message View */}
              <div className="col-span-2 flex flex-col h-full">
                {/* Contact Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Avatar>
                    <AvatarImage 
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${contacts.find(c => c.id === activeContact)?.avatar}`} 
                    />
                    <AvatarFallback>
                      {contacts.find(c => c.id === activeContact)?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="font-medium">
                      {contacts.find(c => c.id === activeContact)?.name}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {contacts.find(c => c.id === activeContact)?.online ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
                
                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {conversations[activeContact]?.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.senderId === currentUserId 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary'
                          }`}
                        >
                          <p>{message.text}</p>
                          <p className={`text-xs mt-1 ${
                            message.senderId === currentUserId 
                              ? 'text-primary-foreground/70' 
                              : 'text-muted-foreground'
                          }`}>
                            {formatMessageTime(message.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(!conversations[activeContact] || conversations[activeContact].length === 0) && (
                      <div className="h-full flex items-center justify-center">
                        <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Type a message..." 
                      className="flex-1"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button onClick={handleSendMessage}>Send</Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Messages;
