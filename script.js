let pMax = 898;
const list = document.querySelector("#list-container");

const getData = async (offset, limit) => {
    const dexResponse = await fetch (`https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`);
    const dexData = await dexResponse.json();
    const results = dexData.results;

    const typeStyleResponse = await fetch("types.json");
    const typeStyleData = await typeStyleResponse.json();

    for(const pokemon of results) {
        const response = await fetch(pokemon.url);
        const data = await response.json();

        const img_url = data.sprites.other["official-artwork"].front_default;
        const id = data.id;
        const name = data.name;
        const types = data.types;
        createListItem(img_url, id, name, types, typeStyleData);
    }
}

const createListItem = (img_url, p_id, p_name, p_types, typeStyleData) => {
    const img_cont = createImg(img_url, p_name);
    const id = createId(p_id);
    const name = createName(p_name);
    const data_cont = document.createElement("div");
    const type_cont = createType(p_types, typeStyleData);
    type_cont.classList.add("p-type-container");
    data_cont.appendChild(id);
    data_cont.appendChild(name);
    data_cont.appendChild(type_cont);
    data_cont.classList.add("p-data-container")

    const li = document.createElement("li");
    li.appendChild(img_cont);
    li.appendChild(data_cont);
    li.classList.add("pokemon")

    list.appendChild(li);
}

const createImg = (img_url, p_name) => {
    const img_cont = document.createElement("div");
    const img = document.createElement("img");
    img.src = img_url;
    img.alt = p_name;

    img.classList.add("p-img");
    img_cont.classList.add("p-img-container");
    img_cont.appendChild(img);
    return img_cont;
}

const createId = (p_id) => {
    const id = document.createElement("p");
    id.textContent = "#" + p_id.toString().padStart(3, "0");

    id.classList.add("p-id");
    return id;
}

const createName = (p_name) => {
    const name = document.createElement("p");
    name.textContent = p_name[0].toUpperCase() + p_name.substring(1);

    name.classList.add("p-name");
    return name;
}

const createType = (p_types, typeStyleData) => {
    const type_cont = document.createElement("div");
    for(const type of p_types) {
        const typeName = type.type.name;
        const name = document.createElement("p");
        name.textContent = typeName[0].toUpperCase() + typeName.substring(1);

        const type_pellet = document.createElement("div");
        type_pellet.appendChild(name);

        type_pellet.classList.add("p-type-pellet");
        name.classList.add("p-type");

        const styleData = getTypeStyle(typeName, typeStyleData);
        applyTypeStyle(type_pellet, name, styleData);
        type_cont.appendChild(type_pellet);
    }
    return type_cont;
}

const getTypeStyle = (p_type, typeStyleData) => {
    const styleData = typeStyleData.filter(type => type["type-name"] === p_type)[0];
    return styleData
}

const applyTypeStyle = (pellet, name, styleData) => {
    if(styleData["multi-color"]) {
        const c1 = styleData["type-color-1"];
        const c2 = styleData["type-color-2"];
        pellet.style.backgroundImage = `linear-gradient(${c1} 50%, ${c2} 50%, ${c2})`;
    }else {
        pellet.style.backgroundColor = styleData["type-color-1"];
    }
    name.style.color = styleData["font-color"];
}

getData(0, 898);