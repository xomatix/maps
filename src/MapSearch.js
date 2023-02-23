

export async function MapSearch(address) {
    console.log("Map search started");
    //load api key
    const API_KEY = 'panGQNYPQhBCZqv6JJG_n_TJBfDi83dHcC2HYQYHEqM';

    //load and convert address
    const addr = encodeURIComponent(arguments[0]);

    try {
        const url = `https://geocode.search.hereapi.com/v1/geocode?q=${addr}&apiKey=${API_KEY}`;
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        console.log(error);
        return "error";
    }
}

export async function DistanceSearch(cordsAText, cordsBText) {
    console.log("Map distance measurement started");
    //load api key
    const API_KEY = 'panGQNYPQhBCZqv6JJG_n_TJBfDi83dHcC2HYQYHEqM';

    //load and convert address
    const cordsA = arguments[0]['lat'] + ',' + arguments[0]['lng'];
    const cordsB = arguments[1]['lat'] + ',' + arguments[1]['lng'];

    try {
        const url = `https://router.hereapi.com/v8/routes?transportMode=car&origin=${cordsA}&destination=${cordsB}&return=summary,polyline&apiKey=${API_KEY}`;
        const response = await fetch(url);
        return await response.json();
    }
    catch (error) {
        console.log(error);
        return "Error getting response";
    }
}

