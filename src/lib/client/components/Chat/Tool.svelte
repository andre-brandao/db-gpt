<script lang="ts">
	import type { ToolInvocation } from 'ai';

	let { args, state, toolCallId, toolName, step }: ToolInvocation = $props();
</script>

<div role="alert" class="alert">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		class="stroke-info h-6 w-6 shrink-0"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
		></path>
	</svg>

	{#if toolName === 'query'}
		<span> {toolName} </span>
		<div class="">
			<div class="mockup-code bg-base-300 text-base-content mb-4">
				<pre data-prefix="$"><code>{args.sql}</code></pre>
			</div>
		</div>
	{:else if toolName === 'pg-schema'}
		<span> Getting PG Schema Info </span>
	{:else}
		<span> {toolName} </span>
		<span class="text-sm opacity-70">
			({state})
		</span>
		<div class="mt-2">
			<pre class="bg-base-200 rounded-md p-2">
               <code>{JSON.stringify(args, null, 2)}</code>
      </pre>
		</div>
	{/if}
</div>
