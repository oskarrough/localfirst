import {useState, memo, useMemo} from 'react'
import {
	FilterFn,
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getSortedRowModel,
	sortingFns,
	useReactTable,
	Table,
	SortingFn,
} from '@tanstack/react-table'
import {RankingInfo, rankItem, compareItems} from '@tanstack/match-sorter-utils'
import type {Track} from '../../src/cli/schema'

declare module '@tanstack/react-table' {
	//add fuzzy filter to the filterFns
	interface FilterFns {
		fuzzy: FilterFn<unknown>
	}
	interface FilterMeta {
		itemRank: RankingInfo
	}
}

// Date formatting
const shortFormatter = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: 'short', day: 'numeric'})
const longFormatter = new Intl.DateTimeFormat('en-US', {
	year: 'numeric',
	month: 'long',
	day: 'numeric',
	hour: 'numeric',
	minute: 'numeric',
	hour12: false,
})

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value)

	// Store the itemRank info
	addMeta({
		itemRank,
	})

	// Return if the item should be filtered in/out
	return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
	let dir = 0

	// Only sort by rank if the column has ranking information
	if (rowA.columnFiltersMeta[columnId]) {
		dir = compareItems(rowA.columnFiltersMeta[columnId]?.itemRank!, rowB.columnFiltersMeta[columnId]?.itemRank!)
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

const columnHelper = createColumnHelper<Track>()

export default function TheTable(props) {
	// console.log('props', props.store.tracks)
	const [data, _setData] = useState(() => [...props.store.tracks])
	const [sorting, setSorting] = useState<SortingState>([
		{
			id: 'title',
			desc: true,
		},
	])
	const [globalFilter, setGlobalFilter] = useState('')
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	const uniqueTags = useMemo(() => {
		// 	const tags = new Set<string>()
		// 	data.forEach((track) => track.tags.forEach((tag) => tags.add(tag)))
		// 	return Array.from(tags).sort()
		const tagCounts: Record<string, number> = {}
		data.forEach((track) => {
			track.tags.forEach((tag) => {
				tagCounts[tag] = (tagCounts[tag] || 0) + 1
			})
		})
		return Object.entries(tagCounts)
			.map(([tag, count]) => ({tag, count}))
			.sort((a, b) => a.tag.localeCompare(b.tag))
	}, [data])

	const columns = useMemo(
		() => [
			{
				id: 'actions',
				header: ({table}) => (
					<input
						type="checkbox"
						name="toggleAllRowsSelected"
						checked={table.getIsAllRowsSelected()}
						// indeterminate={table.getIsSomeRowsSelected()}
						onChange={table.getToggleAllRowsSelectedHandler()} //or getToggleAllPageRowsSelectedHandler
					/>
				),
				cell: ({row}) => (
					<input
						type="checkbox"
						name={row.id}
						checked={row.getIsSelected()}
						disabled={!row.getCanSelect()}
						onChange={row.getToggleSelectedHandler()}
						className="center"
					/>
				),
				size: 40,
			},
			columnHelper.accessor('title', {
				header: () => <span>Title</span>,
				cell: (info) => info.getValue(),
				footer: (info) => info.column.id,
				filterFn: 'fuzzy',
				sortingFn: fuzzySort,
			}),
			columnHelper.accessor((row) => row.description, {
				id: 'description',
				cell: (info) => <i>{info.getValue()}</i>,
				header: () => <span>Description</span>,
				footer: (info) => info.column.id,
				// enableSorting: false,
			}),
			columnHelper.accessor('url', {
				header: () => 'URL',
				cell: (info) => info.renderValue(),
				footer: (info) => info.column.id,
			}),
			columnHelper.accessor('discogs_url', {
				header: () => 'Discogs',
				cell: (info) => info.renderValue(),
				footer: (info) => info.column.id,
			}),
			columnHelper.accessor('tags', {
				header: () => <span>Tags</span>,
				footer: (info) => info.column.id,
				// filterFn: 'arrIncludes',
				filterFn: 'arrIncludesAll',
				// filterFn: (row, columnId, filterValue: string) => {
				// 	const value = row.getValue(columnId) as string[]
				// 	console.log(value, filterValue)
				// 	return value.includes(filterValue)
				// },
			}),
			columnHelper.accessor((row) => row.tags.length, {
				id: 'tag-count',
				header: 'Tag count',
				// accessorFn: (tags) => tags.length,
				cell: (info) => <span className="center">{info.renderValue()}</span>,
				footer: (info) => info.column.id,
				size: 40,
			}),
			columnHelper.accessor('mentions', {
				header: 'Mentions',
				footer: (info) => info.column.id,
				size: 80,
			}),
			columnHelper.accessor('created_at', {
				header: 'Created',
				cell: (info) => {
					const date = new Date(info.getValue())
					return (
						<>
							<time dateTime={date.toISOString()} title={longFormatter.format(date)}>
								{shortFormatter.format(date)}
							</time>
						</>
					)
				},
				footer: (info) => info.column.id,
				size: 60,
			}),
			columnHelper.accessor('updated_at', {
				header: 'Updated',
				footer: (info) => info.column.id,
			}),
		],
		[]
	)

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),

		// column resizing
		// defaultColumn: {
		// 	minSize: 60,
		// 	maxSize: 800,
		// },
		columnResizeMode: 'onChange',

		// sorting
		getSortedRowModel: getSortedRowModel(),
		onSortingChange: setSorting,

		// row selection
		onRowSelectionChange: setRowSelection,
		getRowId: (row) => row.id, // use our own id instead of list index

		// global filter
		onGlobalFilterChange: setGlobalFilter,
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		globalFilterFn: 'fuzzy',
		getFilteredRowModel: getFilteredRowModel(),

		state: {
			sorting,
			rowSelection,
			globalFilter,
		},

		initialState: {
			columnVisibility: {
				url: false,
				discogs_url: false,
				updated_at: false,
			},
		},
	})

	/**
	 * Instead of calling `column.getSize()` on every render for every header
	 * and especially every data cell (very expensive),
	 * we will calculate all column sizes at once at the root table level in a useMemo
	 * and pass the column sizes down as CSS variables to the <table> element.
	 */
	const columnSizeVars = useMemo(() => {
		const headers = table.getFlatHeaders()
		const colSizes: {[key: string]: number} = {}
		for (let i = 0; i < headers.length; i++) {
			const header = headers[i]!
			colSizes[`--header-${header.id}-size`] = header.getSize()
			colSizes[`--col-${header.column.id}-size`] = header.column.getSize()
		}
		return colSizes
	}, [table.getState().columnSizingInfo, table.getState().columnSizing])

	function updateFilterTags(e) {
		const options = Array.from(e.target.selectedOptions)
		const tags = options.map((option) => option.value)
		if (tags.length === 1 && tags[0] === '') {
			table.getColumn('tags')?.setFilterValue('')
		} else {
			table.getColumn('tags')?.setFilterValue(tags)
		}
		console.log('filtered tags', tags)
	}

	function resetFilters() {
		table.resetGlobalFilter()
		table.resetSorting()
		table.resetColumnFilters()
	}
	// const { filters, resetFilters, setFilters } = useFilters(Route.fullPath)

	return (
		<>
			<button onClick={resetFilters}>Reset to default</button>
			<h3>Global fuzzy search</h3>
			<p>
				<label>
					Search
					<input
						type="search"
						name="globalFilter"
						value={globalFilter ?? ''}
						onChange={(event) => setGlobalFilter(String(event.target.value))}
						placeholder="Search all columns..."
					/>
				</label>
			</p>

			<p>
				<label>
					Tags
					<br />
					<select
						multiple
						value={(table.getColumn('tags')?.getFilterValue() as string[]) ?? ['']}
						onChange={updateFilterTags}
					>
						<option value="">All</option>
						{uniqueTags.map((tag) => (
							<option key={tag.tag} value={tag.tag}>
								{tag.tag} ({tag.count} rows)
							</option>
						))}
					</select>
					<br />
				</label>
			</p>

			<h3>Columns</h3>
			<div>
				<label>
					<input
						{...{
							type: 'checkbox',
							name: 'toggleAllColumnsVisible',
							checked: table.getIsAllColumnsVisible(),
							onChange: table.getToggleAllColumnsVisibilityHandler(),
						}}
					/>{' '}
					Toggle All
				</label>
			</div>
			{table.getAllLeafColumns().map((column) => {
				return (
					<div key={column.id} className="px-1">
						<label>
							<input
								{...{
									type: 'checkbox',
									name: column.id,
									checked: column.getIsVisible(),
									onChange: column.getToggleVisibilityHandler(),
								}}
							/>{' '}
							{column.id}
						</label>
					</div>
				)
			})}

			<h3>Sorting</h3>
			<pre>{JSON.stringify(sorting, null, 2)}</pre>

			<h3>Column sizing</h3>
			<pre style={{minHeight: '8rem'}}>
				{JSON.stringify(
					{
						columnSizing: table.getState().columnSizing,
					},
					null,
					2
				)}
			</pre>

			<h3>Row selection</h3>
			<pre>{JSON.stringify(rowSelection, null, 2)}</pre>

			<p>
				{data?.length} Rows ({table.getRowCount().toLocaleString()} filtered)
			</p>

			<table
				style={{
					...columnSizeVars, //Define column sizes on the <table> element
					// width: table.getTotalSize(),
				}}
			>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									className="th"
									style={{
										width: `calc(var(--header-${header?.id}-size) * 1px)`,
									}}
									onClick={header.column.getToggleSortingHandler()}
									title={
										header.column.getCanSort()
											? header.column.getNextSortingOrder() === 'asc'
												? 'Sort ascending'
												: header.column.getNextSortingOrder() === 'desc'
												? 'Sort descending'
												: 'Clear sort'
											: undefined
									}
								>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}

									{{
										asc: ' 🔼',
										desc: ' 🔽',
									}[header.column.getIsSorted() as string] ?? null}

									<div
										{...{
											onDoubleClick: () => header.column.resetSize(),
											onMouseDown: header.getResizeHandler(),
											onTouchStart: header.getResizeHandler(),
											className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
										}}
									></div>
								</th>
							))}
						</tr>
					))}
				</thead>
				{/* When resizing any column we will render this special memoized version of our table body */}
				{table.getState().columnSizingInfo.isResizingColumn ? (
					<MemoizedTableBody table={table} />
				) : (
					<TableBody table={table} />
				)}
				<tfoot>
					{table.getFooterGroups().map((footerGroup) => (
						<tr key={footerGroup.id}>
							{footerGroup.headers.map((header) => (
								<th key={header.id}>
									{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}
								</th>
							))}
						</tr>
					))}
				</tfoot>
			</table>
		</>
	)
}

function TableBody({table}: {table: Table<Track>}) {
	return (
		<tbody>
			{table.getRowModel().rows.map((row) => (
				<tr key={row.id}>
					{row.getVisibleCells().map((cell) => (
						<td
							key={cell.id}
							style={{
								width: `calc(var(--col-${cell.column.id}-size) * 1px)`,
							}}
						>
							{flexRender(cell.column.columnDef.cell, cell.getContext())}
						</td>
					))}
				</tr>
			))}
		</tbody>
	)
}

// special memoized wrapper for our table body that we will use during column resizing
const MemoizedTableBody = memo(
	TableBody,
	(prev, next) => prev.table.options.data === next.table.options.data
) as typeof TableBody
