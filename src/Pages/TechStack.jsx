import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BsPencilSquare } from 'react-icons/bs'; // Make sure to install react-icons
import { FaTrashAlt } from 'react-icons/fa'; // Make sure to install react-icons
import axios from 'axios';
import { endPoint } from '../Components/ForAll/ForAll';
import Swal from 'sweetalert2';

const TechStack = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentEntry, setCurrentEntry] = useState(null);
const [searchTerm, setSearchTerm] = useState('');

  // Function to handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file)); // Preview the image
      setImage(file); // Store the file for uploading
    }
  };

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'description') setDescription(value);
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (image) formData.append('image', image); // Append the image file

        // Log each value (for debugging)
        for (let entry of formData.entries()) {
          console.log(entry);
        }
    try {
      if (isUpdating) {
        // Update existing entry
        const response = await axios.put(`${endPoint}/techstack/${currentEntry._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        const updatedEntries = entries.map(entry => 
          entry._id === currentEntry._id ? response.data.techStack : entry
        );
        setEntries(updatedEntries);
      } else {
        // Add new entry
        
        // Log each value (for debugging)
for (let entry of formData.entries()) {
  console.log(entry);
}
        const response = await axios.post(`${endPoint}/techstack`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setLoading(false)
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${isUpdating ? "Tech Stack updated successfully!":"Tech Stack added successfully!"}`,
            showConfirmButton: false,
            timer: 1500,
          });
        console.log(response.data)
    fetchEntries();

      }
      resetForm();
    } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${error?.response?.data?.message}`,
          showConfirmButton: false,
          timer: 1500,
        })
        setLoading(false);
      } finally {
        setLoading(false);
      }
  };

  // Function to reset the form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setIsUpdating(false);
    setCurrentEntry(null);
  };

  // Function to fetch tech stacks from the backend
  const fetchEntries = async () => {
    try {
        setLoading(true);
      const response = await axios.get(`${endPoint}/techstack`); // Adjust the API endpoint as necessary
      setEntries(response.data.techStack);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching tech stacks:', error);
      setLoading(false);
    }
  };

  // Fetch entries when the component mounts
  useEffect(() => {
    fetchEntries();
  }, []);

  // Function to handle edit of an entry
  const handleEditEntry = (entry) => {
    setTitle(entry.title);
    setDescription(entry.description);
    setImage(entry.image); // Assuming entry.image is the URL for the image
    setCurrentEntry(entry);
    setIsUpdating(true);
  };
const filteredEntries = entries.filter(entry =>
  entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  entry.description.toLowerCase().includes(searchTerm.toLowerCase())
);

  // Function to handle deletion of an entry
  const handleDeleteEntry = async (id) => {
    try {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone. Do you want to continue?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
        });
    
        // If the user confirms the deletion
        if (result.isConfirmed) {
        setLoading(true);
      await axios.delete(`${endPoint}/techstack/${id}`);
      setEntries(entries.filter(entry => entry._id !== id));
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Tech Stack deleted successfully!`,
        showConfirmButton: false,
        timer: 1500,
      });}
      setLoading(false);
    } catch (error) {
        console.error('Error submitting form:', error);
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${error?.response?.data?.message}`,
          showConfirmButton: false,
          timer: 1500,
        })
        setLoading(false);
      } finally {
        setLoading(false);
      }
  };

  // Function to truncate description for display
  const truncateDescription = (text, length) => {
    return text.length > length ? text.substring(0, length) + '...' : text;
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  return (
    <div className="my-10 p-6">
      <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[90%] mx-auto">
        <ul className="my-6">
          <li>
            <Link to="/" className="inline-flex items-center gap-2">
              {/* SVG icon for Home */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                ></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              {/* SVG icon for Manage Team */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                ></path>
              </svg>
              Manage Tech Stack
            </span>
          </li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">
        {isUpdating ? 'Update Tech Stack' : 'Add Tech Stack'}
      </h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title:</label>
          <input
            type="text"
            name="title"
            value={title}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description:</label>
          <textarea
            name="description"
            value={description}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image:</label>
          {image && (
            <img src={image} alt="Tech Stack Preview" className="w-32 h-32 rounded-md object-cover my-3" />
          )}
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="mt-1 file-input file-input-bordered w-full mb-3"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-5 btn btn-sm bg-black text-white font-semibold py-2 rounded-md transition duration-200"
        >
          {isUpdating ? 'Update Tech Stack' : 'Add Tech Stack'}
        </button>
      </form>
<div className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto mt-6">
  <input
    type="text"
    placeholder="Search tech stack..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="p-2 border border-gray-300 rounded-md w-full"
  />
</div>

      {/* List of entries */}
      {filteredEntries?.length > 0 ? (
        <h2 className="text-xl font-semibold mt-10">Tech Stacks</h2>
        
      ) : (
        <p className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto text-white p-4 bg-red-400 rounded-md mt-5">
          No entries found
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-4">
        {filteredEntries?.map((entry) => (
          <div key={entry._id} className="border bg-white rounded-xl p-4 w-60">
            <h3 className="font-bold">{entry.title}</h3>
            <p>{truncateDescription(entry.description, 50)}</p>
            <img src={entry.image} alt={entry.title} className="w-32 h-32 rounded-md object-cover my-3" />
            <div className="flex justify-between mt-3">
              <button
                onClick={() => handleEditEntry(entry)}
                className="text-blue-500 hover:underline"
              >
                <BsPencilSquare className="inline-block" /> Edit
              </button>
              <button
                onClick={() => handleDeleteEntry(entry._id)}
                className="text-red-500 hover:underline"
              >
                <FaTrashAlt className="inline-block" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;