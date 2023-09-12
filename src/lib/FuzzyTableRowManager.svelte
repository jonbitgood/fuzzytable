<script lang="ts">
    export let row: {
        item?: any;
        highlight_key?: string;
        highlight?: string;
        [key: string]: any;
    };

    export let column: {
        id: string;
        subtitle?: string;
        type?: string;
        variation?: string;
        suffix?: string;
    };
    
    export let numberFormatterLocale: string;

    const numberFormatter = new Intl.NumberFormat(numberFormatterLocale);
</script>

{#if row?.item}
{#if row.highlight_key == column.id}
    {@html row.highlight ?? ''}
    {#if column.subtitle}
        <i>{row.item[column.subtitle] ?? ''}</i>
    {/if}
{:else}
    {@html row.item[column.id] ?? ''}
    {#if column.subtitle}
        <i>{row.item[column.subtitle] ?? ''}</i>
    {/if}
{/if}
{:else}
{#if column.type == 'int'}
<div data-variation={column.variation} data-output={(column.variation == 'date' ? 0 : 3)}></div>
    {#if column.variation == "date"}
        {(row[column.id]) ? numberFormatter.format(row[column.id]).replace(/,/g, '') : ''}
    {:else}
        {numberFormatter.format(row[column.id])}
    {/if}
{:else}
    {@html row[column.id] ?? ''}
    {#if column?.subtitle}
        <i>{row[column.subtitle] ?? ''}</i>
    {/if}
{/if}
{/if}
{#if column.suffix}{column.suffix}{/if}