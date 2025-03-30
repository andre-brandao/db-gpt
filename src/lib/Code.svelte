<script lang="ts">
	import { error } from '@sveltejs/kit';
	import type { Snippet } from 'svelte';
	import Table from './Table.svelte';
	
	interface Props {
	  children?: Snippet;
	  lang?: string;
	  text?: string;
	}
	
	const { children, lang, text, ...rest }: Props = $props();
	console.log($state.snapshot(rest));
	
	let response: any = $state(null);
	let loading: boolean = $state(false);
	let errorMessage: string = $state('');
	
	async function runQuery() {
	  try {
		loading = true;
		errorMessage = '';
		
		const resp = await fetch('/api/sql', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({ query: text })
		});
		
		if (!resp.ok) {
		  throw new Error(`Error: ${resp.statusText}`);
		}
		
		response = await resp.json();
	  } catch (err) {
		console.error(err);
		errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
		response = null;
	  } finally {
		loading = false;
	  }
	}
  </script>
  
  {#if lang === 'sql'}
	<div class="card bg-base-200 shadow-md mb-4">
	  <div class="card-body p-4">
		<!-- Code block header with "SQL" label and run button -->
		<div class="flex justify-between items-center mb-2">
		  <div class="badge badge-neutral">SQL</div>
		  <button 
			class="btn btn-primary btn-sm gap-2" 
			onclick={runQuery}
			disabled={loading}
		  >
			{#if loading}
			  <span class="loading loading-spinner loading-xs"></span>
			  Running...
			{:else}
			  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
				<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
			  </svg>
			  Run Query
			{/if}
		  </button>
		</div>
		
		<!-- Code block with syntax highlighting -->
		<div class="mockup-code bg-base-300 text-base-content mb-2">
		  <pre data-prefix="$"><code>{text}</code></pre>
		</div>
		
		<!-- Error message (if any) -->
		{#if errorMessage}
		  <div class="alert alert-error mt-2">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
			  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{errorMessage}</span>
		  </div>
		{/if}
		
		<!-- Results table (if response is available) -->
		{#if response !== null}
		  <div class="divider">Results</div>
		  <div class="overflow-x-auto">
			<Table data={response} />
		  </div>
		{/if}
	  </div>
	</div>
  {:else}
	<!-- For non-SQL code blocks, just show the code -->
	<div class="mockup-code bg-base-300 text-base-content mb-4">
	  <pre data-prefix="$"><code>{text}</code></pre>
	</div>
  {/if}