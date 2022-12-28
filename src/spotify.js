const token = () => localStorage.getItem("token");

// Returns a promise that contains JSON object for the /<api> called
const callApi = (api) =>
  fetch(`https://api.spotify.com/v1/${api}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
    },
  })
    .then((result) => result.json())
    .then((result) => {
      if (result.error) {
        return Promise.reject({
          needLogin: true,
        });
      }
      return result;
    });

// Returns a promise that contains a hash with the current user's name and
// email
export const whoami = () =>
  callApi("me").then((result) => ({
    name: result.display_name,
    email: result.email,
  }));

// Returns a promise that contains an array w/ name, id, and description
// for every playlist of the current user
export const playlists = () =>
  callApi("me/playlists")
    .then((result) => result.items)
    .then((items) =>
      items.map((item) => ({
        name: item.name,
        id: item.id,
        description: item.description,
      }))
    );
