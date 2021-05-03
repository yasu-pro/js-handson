const get_ulelement = document.getElementsByTagName("ul");

const create_li = document.createElement("li");

get_ulelement[0].appendChild(create_li);

create_li.textContent = "これです。";
