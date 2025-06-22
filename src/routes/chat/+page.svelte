<script>
	import { Chat } from '@ai-sdk/svelte';

	const chat = new Chat({ maxSteps: 5 });
</script>

<main class="flex min-h-[70vh] flex-col items-center justify-center bg-white px-2 py-8">
	<div class="flex w-full max-w-xl flex-col rounded-xl border border-gray-100 bg-white shadow-lg">
		<h1 class="py-6 text-center text-2xl font-bold text-gray-800">Chat</h1>
		<ul class="max-h-[60vh] flex-1 space-y-4 overflow-y-auto px-6">
			{#each chat.messages as message, messageIndex (messageIndex)}
				<li class="flex flex-col gap-1">
					<div class="mb-1 text-xs font-semibold tracking-wide text-gray-400 uppercase">
						{message.role === 'user' ? 'You' : 'AI'}
					</div>
					<div class="flex flex-col gap-2">
						{#each message.parts as part, partIndex (partIndex)}
							{#if part.type === 'text'}
								<div
									class="w-fit max-w-full rounded-lg border border-gray-100 bg-gray-50 px-4 py-2 whitespace-pre-line text-gray-800"
								>
									{part.text}
								</div>
							{:else if part.type === 'tool-invocation'}
								<div class="text-blue-500 italic">Tool: {part.toolInvocation.toolName}</div>
							{/if}
						{/each}
					</div>
				</li>
			{/each}
		</ul>
		<form
			onsubmit={chat.handleSubmit}
			class="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-4"
		>
			<input
				bind:value={chat.input}
				class="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-200 focus:outline-none"
				placeholder="Type your message..."
				autocomplete="off"
			/>
			<button
				type="submit"
				class="ml-2 rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus:ring-2 focus:ring-blue-200 focus:outline-none"
			>
				Send
			</button>
		</form>
		{#if chat.error}
			<pre>
      {JSON.stringify(chat.error.stack)}
            <!-- {JSON.stringify(chat.error, null , 2)} -->

    </pre>
		{/if}
	</div>
</main>
