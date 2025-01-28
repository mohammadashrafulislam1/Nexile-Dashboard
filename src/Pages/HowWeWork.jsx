import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencilSquare } from 'react-icons/bs'; // Ensure you have react-icons installed
import { FaTrashAlt } from 'react-icons/fa'; // Ensure you have react-icons installed
import { endPoint } from '../Components/ForAll/ForAll';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const HowWeWork = () => {
  // State variables for form data and list of entries
  const [video, setVideo] = useState('');
  const [title, setTitle] = useState('');
  const [color, setColor] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [entryId, setEntryId] = useState(null);
  const [entries, setEntries] = useState([]); // State for listing entries
  const [isUpdating, setIsUpdating] = useState(false); // Determine if updating or adding
  const [loading, setLoading] = useState(false); // Determine if updating or adding
  console.log(entries)

  // Fetch all entries on component mount
  useEffect(() => {
    fetchEntries();
  }, []);
  const fetchEntries = async () => {
    try {
        setLoading(true)
      const response = await axios.get(`${endPoint}/howwework`);
      setEntries(response.data);
    } catch (error) {
      console.error("Error fetching entries:", error);
    }
    finally{
        setLoading(false)
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'video') setVideo(value);
    if (name === 'thumbnail') setThumbnail(value);
    if (name === 'title') setTitle(value);
    if (name === 'color') setColor(value);
    if (name === 'description') setDescription(value);
  };

  // Handle thumbnail change
  const handleThumbnailChange = (e) => {
    setThumbnail(e.target.files[0]);
  };

  // Submit form handler for add or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('video', video);
    formData.append('title', title);
    formData.append('color', color);
    formData.append('description', description);
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    console.log(thumbnail)

    try {
        setLoading(true)
      if (isUpdating) {
        // Update entry
        await axios.put(`${endPoint}/howwework/${entryId}`, formData, {  
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        alert('Entry updated successfully!');
      } else {
        // Add new entry
        await axios.post(`${endPoint}/howwework`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: `${isUpdating? "How We Work updated successfully!" :"How We Work added successfully!" }`,
            showConfirmButton: false,
            timer: 1500
          });
      }
      // Clear form and reset state
      setVideo('');
      setTitle('');
      setColor('');
      setDescription('');
      setThumbnail(null);
      setIsUpdating(false);
    fetchEntries();
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Error submitting form');
    }
    finally{
        setLoading(false)
    }
  };

  // Handle edit and delete actions
  const handleEditEntry = (entry) => {
    setIsUpdating(true);
    setVideo(entry.video);
    setEntryId(entry._id); // Set the entry ID
    setTitle(entry.title);
    setColor(entry.color);
    setDescription(entry.description);
    setThumbnail(entry.thumbnail); // If you store image URL
  };

  const handleDeleteEntry = async (entryId) => {
    try {
        setLoading(true)
      await axios.delete(`${endPoint}/howwework/${entryId}`);
      alert('Entry deleted successfully!');
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `Entry deleted successfully!`,
        showConfirmButton: false,
        timer: 1500
      });
  
      // Fetch updated entries after deletion
      fetchEntries()
    } catch (error) {
      console.error('Error deleting entry:', error);
      alert('Error deleting entry');
    }
    finally{
        setLoading(fasle)
    }
  };

  const handleReload = () => {
    window.location.reload();
  };
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  const truncateDescription = (description, limit = 100) => {
    if (!description) return '';
    return description.length > limit ? `${description.substring(0, limit)}...` : description;
};


  return (
    <div className="my-10 p-6">
        <div className="breadcrumbs text-sm lg:w-1/2 md:w-[80%] w-[90%] mx-auto">
        <ul className="my-6">
          <li>
            <Link to="/" className="inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="h-4 w-4 stroke-current">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              How We Work
            </span>
          </li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">
        {isUpdating ? 'Update How We Work Entry' : 'Add How We Work Entry'}
      </h2>
      {isUpdating && 
     <button className="btn btn-sm flex justify-center items-center mx-auto bg-black text-white mb-5" onClick={handleReload}>Add Another</button>}

      <form onSubmit={handleSubmit} className=" bg-white shadow-md rounded-lg p-5 lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
        {/* Form fields */}
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700 mb-2">Video URL:</label>
          <input
            type="text"
            name="video"
            value={video}
            onChange={handleInputChange}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div className='mb-3'>
          <label className="block text-sm font-medium text-gray-700  mb-2">Title:</label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Color:</label>
          <input
            type="text"
            name="color"
            value={color}
            onChange={handleInputChange}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail Image:</label>
          {
          thumbnail && 
          <img src={thumbnail} alt={title} className="w-24 h-24 rounded-md object-cover my-3" />
          }
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailChange}
            className="mt-1 file-input file-input-bordered w-full mb-3"
          />
        </div>
        <button
          type="submit"
          className="w-full mt-5 btn btn-sm bg-black text-white font-semibold py-2 rounded-md transition duration-200"
        >
          {isUpdating ? 'Update Entry' : 'Add Entry'}
        </button>
      </form>

      {/* List of entries */}
      {entries?.length > 0 ? (
        <h2 className="text-xl font-semibold mt-10">Explore How We Work</h2>
      ) : (
        <p className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto text-white p-4 bg-red-400 rounded-md mt-5">
          No entries found
        </p>
      )}
      <div className="mt-6 flex flex-wrap gap-4">
        {entries?.map((entry, index) => (
          <div key={index} className="p-4 border bg-white rounded-md">
            <div className="flex gap-3 items-center">
              {entry.thumbnail && (
                <img src={entry.thumbnail} alt={entry?.title} className="w-32 h-32 rounded-md object-cover my-3" />
              )}
              <div>
                <h3 className="text-lg font-bold">{entry?.title}</h3>
                <p>
                {truncateDescription(entry?.description, 40)}
                </p>
              </div>
              <div className="flex justify-between gap-2 mt-4 items-center">
                <button className="text-2xl text-blue-600" onClick={() => handleEditEntry(entry)}>
                  <BsPencilSquare />
                </button>
                <button type="button" className="text-2xl text-red-600" onClick={() => handleDeleteEntry(entry._id)}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HowWeWork;
