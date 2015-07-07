declare module WinJSContrib.Utils {
    function readProperty(obj: any, name: string): any;
}
declare module WinJSContrib.Messenger {
    class SmartWorker {
        constructor(path: string);
        start(eventname: string, data?: any): any;
        dispose(): any;
    }
}
declare module WinJSContrib.Search {
    /**
     * definition for a field
     * @typedef {Object} WinJSContrib.Search.FieldDefinition
     * @property {number} weight weight of the item to rank search results
     * @example
     * { weight : 2}
     */
    /**
     * Definition of an index content
     * @typedef {Object} WinJSContrib.Search.IndexDefinition
     * @property {string} key name of the property considered as a key for the items
     * @property {Object} fields object containing item's property path as name, and {@link WinJSContrib.Search.FieldDefinition} as value
     * @example
     * { key: 'id', fields: { "title": { weight : 5}, "description.detail": { weight : 2}}}
     */
    /**
     * Small text search features based on objet indexing and text stemming. It's inspired by tools like Lucene.
     * For now indexes are stored with WinRT files, but it will soon be extended to support an extensible storage mecanism
     * @namespace WinJSContrib.Search
     */
    /**
     * path for search worker script file
     * @field WinJSContrib.Search.workerPath
     * @type {string}
     */
    var workerPath: string;
    function writeFile(folder: any, fileName: any, CreationCollisionOption: any, objectGraph: any): WinJS.Promise<{}>;
    function openFile(folder: any, fileName: any): WinJS.Promise<{}>;
}

declare module WinJSContrib.Search {
    class Index {
        name: string;
        definition: any;
        onprogress: any;
        folderPromise: any;
        stopWords: any[];
        items: any[];
        storeData: boolean;
        pipeline: WinJSContrib.Search.Stemming.Pipeline;
        /**
         * Search index
         * @class WinJSContrib.Search.Index
         * @classdesc
         * This class is the heart of the search engine. operations performed by this object are synchronous but exposes as promises.
         * This way Index is almost interchangeable with {@link WinJSContrib.Search.IndexWorkerProxy}
         * @param {string} name index name
         * @param {WinJSContrib.Search.IndexDefinition} definition index definition
         */
        constructor(name: any, definition: any);
        /**
         * get number of items in index
         * @function WinJSContrib.Search.Index.prototype.count
         * @returns {WinJS.Promise}
         */
        count(): WinJS.IPromise<number>;
        /**
         * clear index
         * @function WinJSContrib.Search.Index.prototype.clear
         * @returns {WinJS.Promise}
         */
        clear(): WinJS.IPromise<{}>;
        /**
         * release index
         * @function WinJSContrib.Search.Index.prototype.dispose
         */
        dispose(): void;
        /**
         * export index
         * @function WinJSContrib.Search.Index.prototype.export
         */
        export(): {
            definition: any;
            items: any[];
        };
        /**
         * serialize index to string
         * @function WinJSContrib.Search.Index.prototype.toString
         */
        toString(): string;
        /**
         * load index from serialized string
         * @function WinJSContrib.Search.Index.prototype.loadData
         */
        loadData(indexString: any): void;
        /**
         * save index to storage
         * @function WinJSContrib.Search.Index.prototype.save
         * @returns {WinJS.Promise}
         */
        save(): any;
        /**
         * load index from storage
         * @function WinJSContrib.Search.Index.prototype.load
         * @returns {WinJS.Promise}
         */
        load(): any;
        _runSearch(querytext: any, options: any): any[];
        /**
         * search index
         * @function WinJSContrib.Search.Index.prototype.search
         * @param {string} querytext
         * @returns {WinJS.Promise} search result
         */
        search(querytext: any, options: any): WinJS.IPromise<any[]>;
        _searchItem(searchtokens: any, indexitem: any): {
            rank: number;
            key: any;
            item: any;
        };
        /**
         * set index definition
         * @function WinJSContrib.Search.Index.prototype.define
         */
        define(obj: any): void;
        _add(obj: any): WinJS.IPromise<{
            items: any[];
            rawdata: any;
            key: any;
        }>;
        /**
         * add an object to index
         * @function WinJSContrib.Search.Index.prototype.add
         * @param {Object} obj object to index
         * @param {WinJSContrib.Search.IndexDefinition} definition index definition (optional), use index's definition if not defined
         * @returns {WinJS.Promise}
         */
        add(obj: any): WinJS.IPromise<WinJS.IPromise<{
            items: any[];
            rawdata: any;
            key: any;
        }>>;
        /**
         * add an array of objects to index
         * @function WinJSContrib.Search.Index.prototype.addRange
         * @param {Array} items items array
         * @returns {WinJS.Promise}
         */
        addRange(arr: any, progress: any): WinJS.IPromise<{
            indexed: number;
        }>;
        refresh(): void;
        /**
         * prepare a text for search by applying stemming and tokenizing text
         * @function WinJSContrib.Search.Index.prototype.processText
         * @param {string} text
         */
        processText(text: any): {
            items: any[];
            untokenized: any;
        };
        /**
         * Check if a word is a stopword
         * @function WinJSContrib.Search.Index.prototype.checkWord
         * @param {string} word
         */
        checkWord(token: any): any;
        /**
         * split a string into words
         * @function WinJSContrib.Search.Index.prototype.tokenize
         * @param {string} text
         */
        tokenize(token: any): any[];
    }
}

declare module WinJSContrib.Search {
    class IndexGroup {
        indexes: any;
        /**
         * group of indexes
         * @class WinJSContrib.Search.IndexGroup
         * @param {Object} definitions object containing definitions
         * @example
         * var idxgroup = new WinJSContrib.Search.IndexGroup({ peoples: { "firstname": { weight: 42 }} });
         */
        constructor(definitions: any);
        /**
         * add an index to group
         * @function WinJSContrib.Search.IndexGroup.prototype.addIndex
         * @param {string} name index name
         * @param {WinJSContrib.Search.IndexDefinition} definition index definition
         * @params {boolean} async true if index must operate on a web worker
         * @params {Array} items array of items to index
         * @returns {WinJS.Promise}
         */
        addIndex(name: any, definition: any, async: any, items: any): any;
        /**
         * add items to an index
         * @function WinJSContrib.Search.IndexGroup.prototype.addRange
         * @param {string} name index name
         * @params {Array} items array of items to index
         * @returns {WinJS.Promise}
         */
        addRangefunction(name: any, items: any): any;
        /**
         * search group's indexes
         * @function WinJSContrib.Search.IndexGroup.prototype.search
         * @param {string} querytext search query
         */
        search(querytext: any): WinJS.IPromise<{
            hasResult: boolean;
            allResults: any[];
        }>;
        /**
         * save group indexes
         * @function WinJSContrib.Search.IndexGroup.prototype.save
         * @returns {WinJS.Promise}
         */
        save(): WinJS.IPromise<any>;
        /**
         * load group indexes
         * @function WinJSContrib.Search.IndexGroup.prototype.load
         * @returns {WinJS.Promise}
         */
        load(): WinJS.IPromise<any>;
        /**
         * release all indexes
         * @function WinJSContrib.Search.IndexGroup.prototype.dispose
         */
        dispose(): void;
    }
}

declare module WinJSContrib.Search {
    class IndexWorkerProxy {
        worker: WinJSContrib.Messenger.SmartWorker;
        /**
         * @classdesc
         * Proxy for a {@link WinJSContrib.Search.Index} running in a web worker
         * @class
         * @param {string} name index name
         * @param {WinJSContrib.Search.IndexDefinition} definition index definition
         * @param {string} workerpath path for web worker script file (optional)
         */
        constructor(name: string, definition: any, workerpath?: string);
        /**
         * initialize worker
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.init
         * @param {string} name
         * @param {WinJSContrib.Search.IndexDefinition} definition index definition (optional), use index's definition if not defined
         * @returns {WinJS.Promise}
         */
        init(name: any, definition: any, load?: any): any;
        /**
         * start search
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.search
         * @param {string} searchTerm search query
         * @param {Object} options
         * @returns {WinJS.Promise}
         */
        search(searchTerm: any, options: any): any;
        /**
         * get the number of items in index
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.count
         * @returns {WinJS.Promise}
         */
        count(): any;
        /**
         * add an object to index
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.add
         * @param {Object} obj object to index
         * @param {Object} options
         * @returns {WinJS.Promise}
         */
        add(data: any, options: any): any;
        /**
         * add an array of objects to index
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.addRange
         * @param {Array} items items array
         * @param {Object} options
         * @returns {WinJS.Promise}
         */
        addRange(data: any, options: any): any;
        /**
         * release proxy
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.dispose
         */
        dispose(): void;
        /**
         * clear index
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.clear
         * @returns {WinJS.Promise}
         */
        clear(): any;
        /**
         * load index from storage
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.load
         * @returns {WinJS.Promise}
         */
        load(): any;
        /**
         * save index to storage
         * @function WinJSContrib.Search.IndexWorkerProxy.prototype.save
         * @returns {WinJS.Promise}
         */
        save(): any;
    }
}

declare module WinJSContrib.Search.Stemming {
    /**
     * @namespace
     */
    class Pipeline {
        _processors: any[];
        /**
         * stemming pipeline
         * @class WinJSContrib.Search.Stemming.Pipeline
         */
        constructor(definition: any);
        reload: (definition: any) => void;
        /**
         * add a stemming function to pipeline
         * @function WinJSContrib.Search.Stemming.Pipeline.prototype.add
         * @param {function} callback stemming function
         */
        add(callback: any): void;
        /**
         * @function WinJSContrib.Search.Stemming.Pipeline.prototype.clear
         * remove all stemming functions from pipeline
         */
        clear(): void;
        /**
         * apply stemming pipeline to text
         * @function WinJSContrib.Search.Stemming.Pipeline.prototype.run
         * @param {string} text
         */
        run(text: any): any;
    }
}
declare module WinJSContrib.Search.Stemming.Presets {
    var standard: string[];
    var full: string[];
}
declare module WinJSContrib.Search.Stemming.StopWords {
    /**
    * common stop words
    * @field WinJSContrib.Search.Stemming.StopWords.common
    */
    var common: string[];
}
declare module WinJSContrib.Search.Stemming.Op {
    /**
     * built-in stemmings
     * @namespace
     */
    /**
     *
     */
    function lowerCase(token: any): any;
    /**
     *
     */
    function dedup(token: any): any;
    /**
     *
     */
    function dropInitialLetters(token: any): any;
    /**
     *
     */
    function dropBafterMAtEnd(token: any): any;
    /**
     *
     */
    function cTransform(token: any): any;
    /**
     *
     */
    function dTransform(token: any): any;
    /**
     *
     */
    function dropG(token: any): any;
    /**
     *
     */
    function transformG(token: any): any;
    /**
     *
     */
    function dropH(token: any): any;
    /**
     *
     */
    function transformCK(token: any): any;
    /**
     *
     */
    function transformPH(token: any): any;
    /**
     *
     */
    function transformQ(token: any): any;
    /**
     *
     */
    function transformS(token: any): any;
    /**
     *
     */
    function transformT(token: any): any;
    /**
     *
     */
    function dropT(token: any): any;
    /**
     *
     */
    function transformV(token: any): any;
    /**
     *
     */
    function transformWH(token: any): any;
    /**
     *
     */
    function dropW(token: any): any;
    /**
     *
     */
    function transformX(token: any): any;
    /**
     *
     */
    function dropY(token: any): any;
    /**
     *
     */
    function transformZ(token: any): any;
    /**
     *
     */
    function dropVowels(token: any): any;
    /**
     *
     */
    function removeDiacritics(s: any): any;
}
