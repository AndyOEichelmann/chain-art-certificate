import { useEffect, useState } from "react";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

        // code to be runn after evry render (hook)
            // Use to fetch data 
        // dependency arry to run a function after certen renders 
            // {emtpy [] run on first render}
            // {[dependencys] state values that troger useEffect when they run} => when changed value it runs
    useEffect(() => {
        const abortConst = new AbortController();

        setTimeout(() => {
            fetch(url, { signal: abortConst.signal })
                .then(res => {
                    if(!res.ok){
                        throw Error('could not fetch data for that resource');
                    }
                    return res.json();
                })
                .then(data => {
                    setData(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === 'AbortError'){
                        console.log('fetch aborted');
                    } else {
                        setIsLoading(false);
                        setError(err.message);
                    }
                });
        }, 1000);

        return () => abortConst.abort();
    }, [url]);

    return { data, isLoading, error }
}

export default useFetch;