'use client';

import Button from '@/lib/components/ui/Button';
import Input from '@/lib/components/ui/Input';
import MarkdownRenderer from '@/lib/components/ui/MarkdownRenderer';
import { useChat } from '@ai-sdk/react';
import { ArrowUp } from 'lucide-react';

const ChatUi = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <>
      {/* messages display */}
      <div className={`w-full max-w-2xl flex flex-col gap-8 px-6 flex-1 ${messages.length !== 0 && 'pb-24'}`}>
        {messages.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center my-auto pb-4">
            <h3 className='text-center'>ask me about companies&apos; data practices</h3>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`${message.role === 'user' ? '' : ''}`}>
              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <div
                        key={`${message.id}-${i}`}
                        className={`${message.role === 'user' ? 'w-fit max-w-lg ml-auto py-4 px-4 bg-background-light rounded-3xl rounded-tr-none' : 'w-full'}`}>
                        <MarkdownRenderer markDowncontent={part.text} />
                      </div>
                    );
                  case 'reasoning':
                    return (
                      <div key={`${message.id}-${i}`}
                        className="p-4 w-full bg-accent/20 border-2 border-foreground-light/20">
                        <span className='text-xs text-foreground-light/70'>
                          {part.reasoning}</span>
                        </div>
                    )
                }
              })}
            </div>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-2xl mt-auto shrink-0 sticky bottom-0 flex flex-col gap-2 bg-background p-4 rounded-3xl border-4 border-foreground-light/20 focus-within:border-accent/30 transition-all duration-300`}>
        <Input
          name="input"
          value={input}
          onChange={handleInputChange}
          className="w-full !rounded-none"
          inputClassName="!p-0 !border-0 !rounded-none"
        />

        <div className="w-full flex items-end justify-between">
          <span className="pl-1 border-l-2 border-accent/60 font-light text-xs italic text-accent/60">
            We use AI to analyze ToS&apos;s and Privacy Policies.{' '}
          </span>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="!px-2 aspect-square !rounded-full">
            <ArrowUp size={16} />
          </Button>
        </div>
      </form>
    </>
  );
};

export default ChatUi;
