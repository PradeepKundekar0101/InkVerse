import React from 'react';
import { format } from 'timeago.js';

interface CommentBoxProps {
  content: string;
  profile_picture: string;
  user_name: string;
  createdAgo: Date;
}

const CommentBox: React.FC<CommentBoxProps> = ({
  content,
  profile_picture,
  user_name,
  createdAgo,
}) => {
  return (
    <div className="flex items-start space-x-4 py-2 w-[100vw] bg-slate-400">
      <img
        src={profile_picture}
        alt={`${user_name}'s profile`}
        className="h-10 w-10 rounded-full"
      />
      <div className="flex flex-col">
        <div className="flex items-center space-x-2 bg-slate-700">
          <span className="font-semibold">{user_name}</span>
          <span className="text-gray-500">{format(createdAgo)}</span>
        </div>
        <p className="text-gray-700 overflow-wrap break-word  max-w-[90vw]">{content}</p>
      </div>
    </div>
  );
};

export default CommentBox;
