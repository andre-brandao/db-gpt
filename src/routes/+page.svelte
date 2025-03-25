<script>
    import { Chat } from '@ai-sdk/svelte';

    const chat = new Chat();
</script>

<main class="max-w-2xl mx-auto p-4 min-h-screen bg-gray-50">
    <ul class="space-y-4 mb-6">
        {#each chat.messages as message}
            <li class={`p-4 rounded-lg ${
                message.role === 'user' 
                    ? 'bg-blue-500 text-white ml-auto max-w-[80%]' 
                    : 'bg-gray-200 text-gray-800 mr-auto max-w-[80%]'
            }`}>
                <span class="font-semibold">{message.role}:</span> 
                <span class="break-words">{message.content}</span>
            </li>
        {/each}
    </ul>
    <form 
        on:submit={chat.handleSubmit}
        class="flex gap-2 sticky bottom-4"
    >
        <input 
            bind:value={chat.input}
            class="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
        />
        <button 
            type="submit"
            class="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
            Send
        </button>
    </form>
</main>
