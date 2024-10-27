// Firebase imports
import { getDatabase, ref, push, onValue, query, limitToLast } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

// Form and List elements
const linkForm = document.getElementById('linkForm');
const linkInput = document.getElementById('linkInput');
const linkList = document.getElementById('linkList');

// Initialize Firebase Database reference
const database = getDatabase();
const linksRef = ref(database, 'links');

// Function to update the link list from Firebase
function updateLinkList(snapshot) {
    linkList.innerHTML = ''; // Clear the current list

    snapshot.forEach((childSnapshot) => {
        const linkData = childSnapshot.val();
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = linkData.url;
        a.textContent = linkData.url;
        a.className = 'link';
        a.target = '_blank';
        li.appendChild(a);
        linkList.appendChild(li);
    });
    console.log(snapshot.val()); // To see what data is retrieved
}

// Listen for link additions/removals in real-time
onValue(query(linksRef, limitToLast(30)), updateLinkList);

// Handle form submission to add a new link
linkForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const newLink = linkInput.value.trim();
    console.log("Link submitted: ", newLink); // Log the submitted link

    // Validate if the link is an Instagram group link
    const validLinkPattern = /^(https:\/\/(?:www\.|ig\.me\/|instagram\.com\/group\/))[\w.-]+/;
    
    if (newLink && validLinkPattern.test(newLink)) {
        // Add the new link to Firebase
        push(linksRef, { url: newLink });
        linkInput.value = ''; // Clear input field
        console.log("Link added to Firebase."); // Log when link is added
    } else {
        alert('Please enter a valid Instagram group link.');
        console.log("Invalid link."); // Log invalid link attempt
    }
});
