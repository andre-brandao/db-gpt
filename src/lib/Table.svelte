<script lang="ts">
	interface Props {
		data: Record<string, any>[] | any;
	}

	let { data }: Props = $props();

	// Function to format values for display
	function formatValue(value: any): string {
		if (value === null || value === undefined) {
			return 'NULL';
		} else if (typeof value === 'object') {
			return JSON.stringify(value);
		} else {
			return String(value);
		}
	}
</script>

{#if Array.isArray(data) && data.length > 0}
	<div class="overflow-x-auto">
		<table class="table-zebra table w-full">
			<!-- Table header -->
			<thead>
				<tr>
					{#each Object.keys(data[0]) as key, i (i)}
						<th class="bg-base-300">{key}</th>
					{/each}
				</tr>
			</thead>

			<!-- Table body -->
			<tbody>
				{#each data as row, i (i)}
					<tr class="hover">
						{#each Object.values(row) as value, j (j)}
							<td>{formatValue(value)}</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
{:else if Array.isArray(data) && data.length === 0}
	<div class="alert alert-info">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 24 24"
			class="h-6 w-6 shrink-0 stroke-current"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
			></path>
		</svg>
		<span>Query returned no results.</span>
	</div>
{:else}
	<div class="card bg-base-200 p-4">
		<pre class="text-sm break-words whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
	</div>
{/if}
