import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: {
    id: number;
    user: string;
    content: string;
    timestamp: string;
    isCurrentUser: boolean;
  };
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const { user, content, timestamp, isCurrentUser } = message;

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex max-w-[80%] ${
          isCurrentUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {!isCurrentUser && (
          <Avatar className="h-8 w-8 mr-2">
            <AvatarFallback className="bg-green-800 text-black">
              {user.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}

        <div>
          <div
            className={`flex items-center mb-1 ${
              isCurrentUser ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`text-sm font-medium ${
                isCurrentUser
                  ? "text-green-400 mr-2"
                  : "text-green-400 ml-0 mr-2"
              }`}
            >
              {user}
            </span>
            <span className="text-xs text-gray-500">{timestamp}</span>
          </div>

          <div
            className={`rounded-lg px-4 py-2 ${
              isCurrentUser
                ? "bg-green-700 text-black rounded-tr-none"
                : "bg-gray-800 text-gray-100 rounded-tl-none"
            }`}
          >
            {content}
          </div>
        </div>

        {isCurrentUser && (
          <Avatar className="h-8 w-8 ml-2">
            <AvatarFallback className="bg-green-600 text-black">
              {user.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
