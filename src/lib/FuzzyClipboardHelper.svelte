<script>
    import { fade } from 'svelte/transition';
    import {fuzzy} from "./store.js"

    let copysuccessfulNotice = 0;

    const convertToTSV = (objArray) => {
        const array =
            typeof objArray !== "object" ? JSON.parse(objArray) : objArray;
        let str = `${Object.keys(array[0]).join("\t")}\r\n`;

        return array.reduce((str, next) => {
            str += `${Object.values(next).join("\t")}\r\n`;
            return str;
        }, str);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(
            function () {
                console.log("Async: Copying to clipboard was successful!");
            },
            function (err) {
                console.error("Async: Could not copy text: ", err);
            }
        );
    };
</script>

<button
    class="relative inline-flex items-center bg-white dark:bg-stone-800 px-2 h-12 text-stone-400 ring-1 ring-inset ring-stone-400 dark:ring-stone-950 focus:z-10"
    on:click={() => {
        copyToClipboard(convertToTSV($fuzzy.table));
        copysuccessfulNotice = 1;
        setTimeout(() => {
            copysuccessfulNotice = 0;
        }, "2000");
    }}
>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="w-6 h-6 mx-auto dark:text-stone-300"
    >
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
        />
    </svg>
    {#if copysuccessfulNotice}
        <div
            class="rounded-r-md bg-green-50 dark:bg-emerald-800 border border-emerald-100 dark:border-emerald-950 px-4 py-4 absolute -left-[270px] -top-1 w-64"
            transition:fade
        >
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg
                        class="h-5 w-5 text-green-400 dark:text-stone-100"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
                <div class="ml-3">
                    <p
                        class="text-sm font-medium text-green-800 dark:text-stone-200"
                    >
                        Copied current table data
                    </p>
                </div>
            </div>
        </div>
    {/if}
</button>
