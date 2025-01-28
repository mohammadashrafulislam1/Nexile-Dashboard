import { useState, useEffect } from "react";
import axios from "axios";
import { endPoint } from "../Components/ForAll/ForAll";
import { FaTrashAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom";

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    menu: [{ name: "", link: "" }],
    title: "",
    description: "",
    googleReview: "",
    nexileReview: "",
    clients: "",
    experience: "",
    logo: null,
  });
  const [selectedHero, setSelectedHero] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null); // State for logo preview

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const response = await axios.get(`${endPoint}/hero`);
        if (response.data.length > 0) {
          setSelectedHero(response.data[0]);
          setFormData({
            menu: response.data[0].menu.length ? response.data[0].menu : [{ name: "", link: "" }],
            title: response.data[0].title,
            description: response.data[0].description,
            googleReview: response.data[0].googleReview,
            nexileReview: response.data[0].nexileReview,
            clients: response.data[0].clients,
            experience: response.data[0].experience,
            logo: null,
          });
          setLogoPreview(response.data[0].logo); // Set logo preview from the fetched hero
        }
        setLoading(false);
      } catch (error) {
        setError("Failed to load hero.");
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleMenuChange = (index, e) => {
    const { name, value } = e.target;
    const updatedMenu = formData.menu.map((item, idx) =>
      idx === index ? { ...item, [name]: value } : item
    );
    setFormData({ ...formData, menu: updatedMenu });
  };

  const handleAddMenuItem = () => {
    setFormData({
      ...formData,
      menu: [...formData.menu, { name: "", link: "" }],
    });
  };

  const handleRemoveMenuItem = (index) => {
    const updatedMenu = formData.menu.filter((_, idx) => idx !== index);
    setFormData({ ...formData, menu: updatedMenu });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, logo: file });
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl); // Update the logo preview state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const form = new FormData();

    // Append other fields normally
    Object.keys(formData).forEach((key) => {
      if (key !== 'menu') {
        form.append(key, formData[key]);
      }
    });

    // Append menu items correctly
    formData.menu.forEach((menuItem, index) => {
      form.append(`menu[${index}][name]`, menuItem.name);
      form.append(`menu[${index}][link]`, menuItem.link);
    });

    try {
      if (selectedHero) {
        await axios.put(`${endPoint}/hero/${selectedHero._id}`, form);
        toast.success("Hero updated successfully!");
      } else {
        await axios.post(`${endPoint}/hero`, form);
        toast.success("Hero added successfully!");
      }
      setFormData({
        menu: [{ name: "", link: "" }],
        title: "",
        description: "",
        googleReview: "",
        nexileReview: "",
        clients: "",
        experience: "",
        logo: null,
      });
      setLogoPreview(null); // Reset logo preview
      setFormLoading(false);
      window.location.reload();
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data.error || "Failed to submit form.");
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${endPoint}/hero/${selectedHero._id}`);
      toast.success("Hero deleted successfully!");
      window.location.reload();
    } catch (error) {
      toast.error("Failed to delete hero.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-bars loading-lg"></span>
      </div>
    );
  }
  if (error) return <div>{error}</div>;
  
  return (
    <div className="p-8">
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
              Manage Hero
            </span>
          </li>
        </ul>
        <ToastContainer/>
      </div>

      {/* Form for Adding/Updating Hero */}
      <form onSubmit={handleSubmit} className="lg:w-1/2 md:w-[80%] w-[96%] mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h4 className="text-xl font-semibold text-center mb-4">
          {selectedHero ? "Update Hero" : "Add Hero"}
        </h4>

        {/* Dynamic Menu Items */}
        <div className="space-y-4">
          {formData?.menu.map((menuItem, index) => (
            <div key={index} className="flex gap-3 items-center justify-center">
              <div className="flex flex-col w-full">
                <label className="font-medium">Menu Name</label>
                <input
                  type="text"
                  name="name"
                  value={menuItem.name}
                  onChange={(e) => handleMenuChange(index, e)}
                  className="input input-bordered"
                  placeholder="Menu Name"
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-medium">Menu Link</label>
                <input
                  type="text"
                  name="link"
                  value={menuItem.link}
                  onChange={(e) => handleMenuChange(index, e)}
                  className="input input-bordered "
                  placeholder="Menu Link"
                />
              </div>
              <button
                type="button"
                onClick={() => handleRemoveMenuItem(index)}
                className="w-[10%] text-xl text-red-600 flex"
              ><FaTrashAlt />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddMenuItem}
            className="text-5xl text-green-800"
          >
            +
          </button>
        </div>

        {/* Other fields */}
        <div className="flex flex-col mt-5">
          <label className="mb-1 font-medium">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="input input-bordered "
            placeholder="Title"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="textarea textarea-bordered "
            placeholder="Description"
          ></textarea>
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Google Review</label>
          <input
            type="text"
            name="googleReview"
            value={formData.googleReview}
            onChange={handleInputChange}
            className="input input-bordered"
            placeholder="Google Review"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Nexile Review</label>
          <input
            type="text"
            name="nexileReview"
            value={formData.nexileReview}
            onChange={handleInputChange}
            className="input input-bordered"
            placeholder="Nexile Review"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Clients</label>
          <input
            type="text"
            name="clients"
            value={formData.clients}
            onChange={handleInputChange}
            className="input input-bordered"
            placeholder="Clients"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Experience</label>
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleInputChange}
            className="input input-bordered"
            placeholder="Experience"
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-medium">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input input-bordered"
          />
          {logoPreview && (
            <img
              src={logoPreview}
              alt="Logo Preview"
              className="mt-4 h-16 object-contain border bg-black w-36 rounded-xl p-2"
            />
          )}
        </div>

        <button
          type="submit"
          className={`btn w-full ${formLoading ? "loading" : ""} bg-black text-white btn-sm mt-4`}
        >
          {formLoading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {selectedHero && (
        <button
          className="btn btn-sm bg-red-600 text-white w-[30%] mx-auto flex justify-center mt-4"
          onClick={handleDelete}
        >
          Delete Hero
        </button>
      )}
    </div>
  );
};

export default Hero;
