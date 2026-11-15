import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { FaMagnifyingGlass } from "react-icons/fa6";

import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import EmpHeader from "../components/EmpHeader";
import JsHeader from "../components/Jsheader";
import Footer from "../components/Footer";

function Home() {
  // Authentication
  const adminToken = localStorage.getItem("adminToken");
  const jsToken = localStorage.getItem("jsToken");
  const empToken = localStorage.getItem("empToken");

  // States
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [jobCategories, setJobCategories] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [latestJobs, setLatestJobs] = useState([]);
  const [index, setIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredJobs, setFilteredJobs] = useState([]);

  // Responsive category slider
  const [visibleCount, setVisibleCount] = useState(
    window.innerWidth <= 600 ? 1 : 2
  );

  // Update visible categories based on screen size
  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth <= 600 ? 1 : 2);
    };

    window.addEventListener("resize", updateVisibleCount);

    return () => {
      window.removeEventListener("resize", updateVisibleCount);
    };
  }, []);

  // Company logo helper
  const getImageUrl = (url) => {
    return url || "https://via.placeholder.com/100";
  };

  // Job image URL helper
  const getJobImageUrl = (logoPath) => {
    if (!logoPath) {
      return "https://via.placeholder.com/100";
    }

    return `${import.meta.env.VITE_API_URL}${logoPath}`;
  };

  // Fetch all jobs for categories
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/jobs`)
      .then((res) => res.json())
      .then(setJobCategories)
      .catch((err) =>
        console.error("Error fetching jobs:", err)
      );
  }, []);

  // Extract unique categories
  const uniqueCategories = Array.from(
    new Set(jobCategories.map((job) => job.category))
  ).map((category) =>
    jobCategories.find((job) => job.category === category)
  );

  // Keep slider index valid when categories or screen size changes
  useEffect(() => {
    setIndex((prev) =>
      Math.min(
        prev,
        Math.max(0, uniqueCategories.length - visibleCount)
      )
    );
  }, [uniqueCategories.length, visibleCount]);

  // Fetch top companies
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/topcompanies`)
      .then((res) => res.json())
      .then(setCompanies)
      .catch((err) =>
        console.error("Error fetching companies:", err)
      );
  }, []);

  // Fetch latest jobs
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/home/latestjobs?limit=3`)
      .then((res) => res.json())
      .then(setLatestJobs)
      .catch((err) =>
        console.error("Error fetching latest jobs:", err)
      );
  }, []);

  // Search jobs
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    fetch(
      `${import.meta.env.VITE_API_URL}/api/home/searchjobs?title=${encodeURIComponent(search)}`
    )
      .then((res) => res.json())
      .then(setSearchResults)
      .catch((err) =>
        console.error("Search failed:", err)
      );
  }, [search]);

  // Previous category
  const handlePrev = () => {
    setIndex((prev) => Math.max(0, prev - 1));
  };

  // Next category
  const handleNext = () => {
    setIndex((prev) =>
      Math.min(
        Math.max(0, uniqueCategories.length - visibleCount),
        prev + 1
      )
    );
  };

  // Fetch jobs for selected category
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    fetch(
      `${import.meta.env.VITE_API_URL}/api/home/categoryjobs?category=${encodeURIComponent(category)}`
    )
      .then((res) => res.json())
      .then(setFilteredJobs)
      .catch((err) =>
        console.error("Error fetching category jobs:", err)
      );
  };

  return (
    <>
      {/* Authentication-based Header */}
      {adminToken ? (
        <AdminHeader />
      ) : jsToken ? (
        <JsHeader />
      ) : empToken ? (
        <EmpHeader />
      ) : (
        <Header />
      )}

      {/* SEARCH SECTION */}

      <section className="home-search-bar">
        <h2 className="home-main-heading">
          Search Apply & Get Your{" "}
          <span className="home-highlight">Dream Job</span>
        </h2>

        <p className="home-description">
          Explore thousands of job listings and connect with top companies.
        </p>

        <div className="home-search-input">
          <input
            type="text"
            placeholder="Find Your Dream Job"
            className="home-input-field"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="button" className="home-search-button" aria-label="Search jobs">
            <FaMagnifyingGlass />
          </button>
        </div>

        {/* Search Results */}
        {search.trim() && (
          <div className="home-job-results">
            {searchResults.length > 0 ? (
              searchResults.map((job, idx) => (
                <div key={idx} className="home-job-card">
                  <img
                    src={getJobImageUrl(job.company_logo)}
                    alt={job.company || "Company logo"}
                    className="home-job-img"
                  />

                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <p>{job.desc}</p>
                  <p>{job.location}</p>
                </div>
              ))
            ) : (
              <p className="home-text-red-600">
                No job found
              </p>
            )}
          </div>
        )}
      </section>

      {/* JOB CATEGORIES */}

      <section className="home-categories-section">
        <h3 className="home-categories-title">
          Job Categories
        </h3>

        <p className="home-categories-subtitle">
          Explore our extensive job market.
        </p>

        <div className="home-categories-slider">
          <button type="button" onClick={handlePrev} className="home-slider-arrow" aria-label="Previous categories" disabled={index === 0} >
            <FiArrowLeft />
          </button>

          <div className="home-slider-container">
            <div className="home-slider-track"
              style={{
                transform: `translateX(-${index * 200}px)`,
              }} >
              {uniqueCategories.length > 0 ? (
                uniqueCategories.map((job, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`home-category-button ${
                      selectedCategory === job.category ? "active" : ""
                    }`}
                    onClick={() =>
                      handleCategoryClick(job.category)
                    } >
                    {job.category}
                  </button>
                ))
              ) : (
                <p>No Categories found.</p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="home-slider-arrow"
            aria-label="Next categories"
            disabled={
              index >= uniqueCategories.length - visibleCount
            } >
            <FiArrowRight />
          </button>
        </div>
      </section>

      {/* FILTERED JOBS */}

      {selectedCategory && (
        <section className="home-filtered-jobs">
          <h3 className="home-section-title">
            Jobs in{" "}
            <span className="home-highlight">
              {selectedCategory}
            </span>
          </h3>

          <div className="home-job-list">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, idx) => (
                <div key={idx} className="home-job-card">
                  <img
                    src={getJobImageUrl(job.company_logo)}
                    alt={job.company || "Company logo"}
                    className="home-job-img"
                  />

                  <h4>{job.title}</h4>
                  <p>{job.company}</p>
                  <p>{job.location}</p>

                  <p>
                    {job.type} | {job.salary || "Negotiable"}
                  </p>
                </div>
              ))
            ) : (
              <p>No jobs found in this category.</p>
            )}
          </div>
        </section>
      )}

      {/* TOP COMPANIES */}

      <section className="home-top-companies">
        <h2 className="home-section-title">
          Top Companies
        </h2>

        <div className="home-company-logos">
          {companies.length > 0 ? (
            <div className="home-marquee-track">
              {companies.map((company, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(company.company_logo)}
                  alt={company.name || "Company logo"}
                  title={company.name}
                  className="home-company-logo"
                />
              ))}
            </div>
          ) : (
            <p>No top companies found.</p>
          )}
        </div>
      </section>

      {/* LATEST JOBS */}

      <section className="home-latest-jobs">
        <h3 className="home-section-title">
          <span className="home-highlight">
            Latest & Top{" "}
          </span>
          Job Openings
        </h3>

        <div className="home-job-list">
          {latestJobs.length > 0 ? (
            latestJobs.map((job, idx) => (
              <div key={idx} className="home-job-card">
                <img
                  src={getJobImageUrl(job.company_logo)}
                  alt={job.company || "Company logo"}
                  className="home-job-img"
                />

                <h4>{job.title}</h4>
                <p>{job.company}</p>
                <p>{job.location}</p>

                <p>
                  {job.type} | {job.salary || "Negotiable"}
                </p>
              </div>
            ))
          ) : (
            <p>No latest jobs found.</p>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </>
  );
}

export default Home;
