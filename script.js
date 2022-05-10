const postsUrl = "http://jsonplaceholder.typicode.com/posts";
const usersUrl = "http://jsonplaceholder.typicode.com/users";

function logData(param) {
    if (!param) {
        alert("Некорректный параметр");
    }
    console.log(JSON.stringify(param, null, 2));
};

async function loadData(url) {
    const response = await fetch(url);
    const data = await response.json();

    if(data // null and undefined check
    && Object.keys(data).length === 0
    && Object.getPrototypeOf(data) === Object.prototype) {
        alert("Введен неверный url адрес для получения данных");
    }

    return data;
};

async function changeAndShowData() {

    const usersArrOfObj = await loadData(usersUrl); // Array of objects
    const postsArrOfObj = await loadData(postsUrl); // Array of objects

    let finalObject;
    let finalArray = [];

    let postsArray = Object.entries(postsArrOfObj);
    let postId = postsArray[10][1]["id"]; // the first post of Ervin Howell, comments will be added according to this postId
    let counter = 0;

    for (let i = 0; i < usersArrOfObj.length; i++) {

        let { username, ...newObj } = usersArrOfObj[i]; // delete username property (unmutable) from main object
        let usersKeysArray = Object.entries(newObj);
        let addressesArray = Object.entries(newObj.address);
        let finalPosts = [];

        for (; counter < postsArray.length; counter++) { // posts processing

            if (postsArray[counter][1]["userId"] > usersKeysArray[0][1]) {
                break; 
            }

            // structure of the changed post
            let post = {
                id: null,
                title: null,
                title_crop: null,
                body: null
            };

            post.id = postsArray[counter][1]["id"];
            post.title = postsArray[counter][1]["title"];
            post.title_crop = `${postsArray[counter][1]["title"].slice(0, 20)}...`;
            post.body = postsArray[counter][1]["body"];

            if (usersKeysArray[1][1] === "Ervin Howell") { // adding comments to the posts of Ervin Howell
                let commentsUrl = `http://jsonplaceholder.typicode.com/posts/${postId}/comments`;
                post.comments = await loadData(commentsUrl);
                ++postId;
            }

            finalPosts.push(post);
        }

        // address processing
        let finalAddress = [];
        let strAddress;
        let addressesCounter = 0;

        for (let j = 0; j < addressesArray.length; j++) {

            if (addressesArray[j][0] === 'city') {
                finalAddress.splice(0, 0, addressesArray[j][1]);
                ++addressesCounter;
            }
            if (addressesArray[j][0] === "street") {
                finalAddress.splice(1, 0, addressesArray[j][1]);
                ++addressesCounter;
            }
            if (addressesArray[j][0] === "suite") {
                finalAddress.splice(2, 0, addressesArray[j][1]);
                ++addressesCounter;
            }

            if (addressesCounter === 3) {
                strAddress = finalAddress.join(", ");
                addressesCounter = 0;
                break;
            }
        }

        finalObject = {
            id: usersKeysArray[0][1],
            name: usersKeysArray[1][1],
            email: usersKeysArray[2][1],
            address: strAddress,
            website: `https://${usersKeysArray[5][1]}`,
            company: Object.entries(usersKeysArray[6][1])[0][1],
            posts: finalPosts,
        }

        finalArray.push(finalObject);
    }

    logData(finalArray);

};

changeAndShowData();