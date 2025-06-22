<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	
	import { enhance } from '$app/forms';
	
	import type { PageData, ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	

	// Get current status from URL params, default to empty string for "all"
	// let selectedStatus = $page.url.searchParams.get('status') || '';

	// Handle status filter change
	function handleStatusChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		const newStatus = target.value;
		
		// Create new URL with updated status and reset page to 1
		const url = new URL(page.url);
		
		if (newStatus === '') {
			// Remove status param if "all" is selected
			url.searchParams.delete('status');
		} else {
			url.searchParams.set('status', newStatus);
		}
		
		// Always reset to page 1 when filtering
		url.searchParams.set('page', '1');
		
		// Navigate to the new URL
		goto(url.toString());
	}

	// Helper function to build pagination URLs with current filters
	function buildPaginationUrl(pageNum: number): string {
		const url = new URL(page.url);
		url.searchParams.set('page', pageNum.toString());
		return url.toString();
	}
</script>

<div class="min-h-[80vh] bg-gray-50 py-8">
	<div class="mx-auto max-w-7xl px-4">
		<!-- Page Header -->
		<!-- <div class="mb-8">
			<h1 class="text-3xl font-bold text-gray-900">Resources</h1>
			<p class="mt-2 text-gray-600">Manage and view all your resources</p>
		</div> -->

		
		<!-- Alert Messages -->
		{#if form?.message && form?.success}
			<div class="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
				<div class="flex items-center">
					<svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
					</svg>
					<p class="ml-3 text-sm font-medium text-green-800">{form.message}</p>
				</div>
			</div>
		{/if}

		{#if form?.message && !form?.success}
			<div class="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
				<div class="flex items-center">
					<svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<p class="ml-3 text-sm font-medium text-red-800">{form.message}</p>
				</div>
			</div>
		{/if}

		<!-- Stats Card -->
		<div class="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
			<div class="flex items-center justify-between">
				<div>
					<p class="text-sm font-medium text-gray-500">Total Resources</p>
					<p class="text-2xl font-bold text-gray-900">{data.totalCount}</p>
					<form method="POST" action="?/embedAllPending" use:enhance>
						<button type="submit" class="mt-2 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
							Embed all pending
						</button>
					</form>
				</div>
				<div class="text-right">
					<p class="text-sm text-gray-500">
						Page {data.page} of {data.totalPages}
					</p>
				</div>
			</div>
		</div>

		<!-- Resources Table -->
		<div class="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
			<div class="border-b border-gray-200 px-6 py-4">
				<h2 class="text-lg font-semibold text-gray-900">All Resources</h2>
			</div>

			<div class="overflow-x-auto">
				<table class="min-w-full divide-y divide-gray-200">
					<thead class="bg-gray-50">
						<tr>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								ID
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Created By
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Created At
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Status
							</th>
							<th
								class="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase"
							>
								Source
							</th>
							<th class="relative px-6 py-3">
								<span class="sr-only">Actions</span>
							</th>
						</tr>
						<!-- Filter row -->
						<tr>
							<td class="px-6 py-2"></td>
							<td class="px-6 py-2"></td>
							<td class="px-6 py-2"></td>
							<td class="px-6 py-2">
								<select 
									id="status"
									name="status" 
									class="mt-1 block w-40 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" 
									value={page.url.searchParams.get('status')}
									onchange={handleStatusChange}
								>
									<option value="">All Statuses</option>
									<option value="draft">Draft</option>
									<option value="published">Published</option>
									<option value="archived">Archived</option>
									<option value="deleted">Deleted</option>
									<option value="pending_review">Pending Review</option>
									<option value="pending_embedding">Pending Embeddings</option>
								</select>
							</td>
							<td class="px-6 py-2"></td>
							<td class="px-6 py-2"></td>
						</tr>
					</thead>
					<tbody class="divide-y divide-gray-200 bg-white">
						{#each data.resources as resource}
							<tr class="transition-colors hover:bg-gray-50">
								<td class="px-6 py-4 whitespace-nowrap">
									<span class="font-mono text-sm text-gray-900" title={resource.id}>
										{resource.id.length > 10 ? resource.id.substring(0, 10) + '...' : resource.id}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">{resource.createdBy}</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{new Date(resource.createdAt).toLocaleDateString('pt-BR', {
											year: 'numeric',
											month: '2-digit',
											day: '2-digit',
											hour: '2-digit',
											minute: '2-digit'
										})}
									</div>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<span
										class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
										{resource.status === 'published'
											? 'bg-green-100 text-green-800'
											: resource.status === 'draft'
												? 'bg-yellow-100 text-yellow-800'
												: resource.status === 'archived'
													? 'bg-gray-100 text-gray-800'
													: resource.status === 'deleted'
														? 'bg-red-100 text-red-800'
														: resource.status === 'pending_review'
															? 'bg-blue-100 text-blue-800'
															: 'bg-gray-100 text-gray-800'}"
									>
										{resource.status}
									</span>
								</td>
								<td class="px-6 py-4 whitespace-nowrap">
									<div class="text-sm text-gray-900">
										{resource.source && resource.source.length > 10
											? resource.source.substring(0, 10) + '...'
											: resource.source}
									</div>
								</td>
								<td class="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
									<a
										href="/resources/{resource.id}"
										class="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-500"
									>
										<svg
											class="mr-1.5 h-4 w-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
											/>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
											/>
										</svg>
										View
									</a>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>

			<!-- Empty State -->
			{#if data.resources.length === 0}
				<div class="py-12 text-center">
					<svg
						class="mx-auto h-12 w-12 text-gray-400"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
						/>
					</svg>
					<h3 class="mt-2 text-sm font-medium text-gray-900">No resources found</h3>
					<p class="mt-1 text-sm text-gray-500">
						{#if page.url.searchParams.get('status')}
							No resources found with status "{page.url.searchParams.get('status')}". Try selecting a different status or clear the filter.
						{:else}
							Get started by creating your first resource.
						{/if}
					</p>
				</div>
			{/if}
		</div>

		<!-- Pagination -->
		{#if data.totalPages > 1}
			<div class="mt-6 flex items-center justify-between">
				<div class="flex items-center text-sm text-gray-500">
					<span>
						Showing {(data.page - 1) * 10 + 1} to {Math.min(data.page * 10, data.totalCount)} of {data.totalCount}
						results
					</span>
				</div>

				<div class="flex items-center space-x-2">
					{#if data.page > 1}
						<a
							href={buildPaginationUrl(data.page - 1)}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
						>
							<svg class="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							Previous
						</a>
					{/if}

					<!-- Page Numbers -->
					<div class="flex items-center space-x-1">
						{#each Array.from({ length: Math.min(5, data.totalPages) }, (_, i) => {
							const startPage = Math.max(1, data.page - 2);
							return startPage + i;
						}).filter((page) => page <= data.totalPages) as page}
							<a
								href={buildPaginationUrl(page)}
								class="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors
									{page === data.page
									? 'bg-blue-600 text-white'
									: 'border border-gray-300 bg-white text-gray-500 hover:bg-gray-50 hover:text-gray-700'}"
							>
								{page}
							</a>
						{/each}
					</div>

					{#if data.page < data.totalPages}
						<a
							href={buildPaginationUrl(data.page + 1)}
							class="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
						>
							Next
							<svg class="ml-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</a>
					{/if}
				</div>
			</div>
		{/if}
	</div>
</div>