<script>
	import Code from '$lib/Code.svelte';
	import { Chat } from '@ai-sdk/svelte';

	const chat = new Chat();
	import SvelteMarkdown from '@humanspeak/svelte-markdown';
</script>

<main class="mx-auto min-h-screen max-w-2xl bg-gray-50 p-4">
	<ul class="mb-6 space-y-4">
		{#each chat.messages as message}
			<li
				class={`rounded-lg p-4 ${
					message.role === 'user'
						? 'ml-auto max-w-[80%] bg-blue-500 text-white'
						: 'mr-auto max-w-[80%] bg-gray-200 text-gray-800'
				}`}
			>
				<span class="font-semibold">{message.role}:</span>
				<span class="break-words">
					<SvelteMarkdown
						source={message.content}
						renderers={{
							code: Code
						}}
					/>
				</span>
			</li>
		{/each}
	</ul>
	<form on:submit={chat.handleSubmit} class="sticky bottom-4 flex gap-2">
		<input
			bind:value={chat.input}
			class="flex-1 rounded-lg border border-gray-300 p-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
			placeholder="Type your message..."
		/>
		<button
			type="submit"
			class="rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
		>
			Send
		</button>
	</form>
</main>
