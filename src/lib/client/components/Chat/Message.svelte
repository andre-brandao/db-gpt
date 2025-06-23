<script lang="ts">
	import type { UIMessage } from 'ai';
	import SvelteMarkdown from 'svelte-markdown';
	import Code from '$lib/client/components/Chat/Code.svelte';
	import Tool from '$lib/client/components/Chat/Tool.svelte';
	import Attachment from '$lib/client/components/Chat/Attachment.svelte';

	let message: UIMessage = $props();
</script>

<div class="flex {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div
		class="max-w-3/4 {message.role === 'user'
			? 'bg-primary text-primary-content rounded-tl-lg rounded-tr-lg rounded-bl-lg'
			: 'bg-base-200 text-base-content rounded-tl-lg rounded-tr-lg rounded-br-lg'} p-3 shadow-sm"
	>
		{#each message.parts as part, partIndex (partIndex)}
			{#if part.type === 'text'}
				<div class="">
					<SvelteMarkdown
						source={message.content}
						renderers={{
							// @ts-expect-error it works
							code: Code
						}}
					/>
				</div>
			{:else if part.type === 'reasoning'}
				<div class="italic">
					Reasoning: {part.reasoning}
				</div>
			{:else if part.type === 'file'}
				<div>
					File: {part.mimeType}
				</div>
			{:else if part.type === 'tool-invocation'}
				<Tool {...part.toolInvocation} />
			{/if}

			{#each message?.experimental_attachments ?? [] as attachment (attachment)}
				<Attachment {attachment} />
			{/each}
		{/each}
	</div>
</div>
