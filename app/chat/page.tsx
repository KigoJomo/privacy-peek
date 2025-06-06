import ChatUi from './components/ChatUi';

export default function ChatPage() {
  return (
    <section className="flex-1 overflow-y-auto relative hide-scrollbar flex flex-col items-center">
      <ChatUi />
    </section>
  );
}
