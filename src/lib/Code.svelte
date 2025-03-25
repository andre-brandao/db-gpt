<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';

	interface Props {
		children?: Snippet;

		lang?: string;
		text?: string;
	}

	const { children, lang, text, ...rest }: Props = $props();
	console.log($state.snapshot(rest));

	let response: any = $state(null);

	async function runQuery() {
		try {
			const resp = await fetch('/api/sql', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ query: text })
			});

			response = await resp.json();
		} catch (error) {
			console.error(error);
			response = error;
		}
	}
</script>

{#if lang === 'sql'}
	<div class="bg-gray-100 p-4">
		<!-- <svelte:boundary
			onerror={(error, reset) => {
				console.error(error);
				reset();
			}}
		>
    </svelte:boundary> -->
		<button class="bg-red-400" onclick={runQuery}> RunQuery </button>
		<pre {lang}>
        <code>
{text}
        </code>
    </pre>

		{#if response !== null}
			{JSON.stringify(response)}
		{/if}
	</div>
{:else}
	<pre {lang}>
         <code>
             <!-- {@render children?.()} -->
     {text}
         </code>
     </pre>
{/if}
