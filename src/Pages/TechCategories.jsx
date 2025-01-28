import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { endPoint } from '../Components/ForAll/ForAll';
import Swal from 'sweetalert2';

const TechCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories from the backend
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
    setLoading(true)
      const { data } = await axios.get(`${endPoint}/techCategory`);
      setCategories(data.techCategories);
    setLoading(false)
    } catch (error) {
    setLoading(false)
    console.error("Error fetching categories:", error);
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      if (isUpdating) {
        await axios.put(`${endPoint}/techCategory/${currentId}`, { name });
      } else {
        await axios.post(`${endPoint}/techCategory`, { name });
      }
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: `${isUpdating ? "Tech Category updated successfully!":"Tech Category added successfully!"}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setName('');
      setIsUpdating(false);
    setLoading(false)
    fetchCategories();
    } catch (error) {
      console.error("Error saving category:", error);
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: `${error?.response?.data?.message}`,
        showConfirmButton: false,
        timer: 1500,
      })
    setLoading(false)

    }
  };

  // Edit category
  const handleEdit = (category) => {
    setName(category.name);
    setCurrentId(category._id);
    setIsUpdating(true);
  };

  // Delete category
  const handleDelete = async (id) => {
    try {
    setLoading(true)
      await axios.delete(`${endPoint}/techCategory/${id}`);
      fetchCategories();
    setLoading(false)
    } catch (error) {
      console.error("Error deleting category:", error);
    setLoading(false)

    }
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
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path>
              </svg>
              Home
            </Link>
          </li>
          <li>
            <span className="inline-flex items-center gap-2">
              {/* SVG icon for Manage Tech Stack */}
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-4 w-4 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Manage Tech Stack
            </span>
          </li>
        </ul>
      </div>
      <h2 className="text-2xl font-semibold text-center mb-4">{isUpdating ? 'Update Tech Category' : 'Add Tech Category'}</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-5 lg:w-1/2 md:w-[80%] w-[96%] mx-auto">
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-2">Name:</label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <button type="submit" className="w-full mt-5 btn btn-sm bg-black text-white font-semibold py-2 rounded-md transition duration-200">
          {isUpdating ? 'Update Tech Category' : 'Add Tech Category'}
        </button>
      </form>

      {/* List of tech categories */}
      {categories?.length > 0 ? (
        <h2 className="text-xl font-semibold mt-10">Tech Categories</h2>
      ) : (
        <p className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto text-white p-4 bg-red-400 rounded-md mt-5">No categories found</p>
      )}
      <div className="mt-6 flex flex-wrap gap-4">
        {categories?.map((category) => (
          <div key={category._id} className="border bg-white rounded-xl p-4 w-60">
            <h3 className="font-bold">{category.name}</h3>
            <div className="flex justify-between mt-3">
              <button onClick={() => handleEdit(category)} className="text-blue-500 hover:underline">
                <BsPencilSquare className="inline-block" /> Edit
              </button>
              <button onClick={() => handleDelete(category._id)} className="text-red-500 hover:underline">
                <FaTrashAlt className="inline-block" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechCategories;
