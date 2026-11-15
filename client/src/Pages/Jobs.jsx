import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FiSearch, FiMapPin, FiClock, FiUsers, FiDollarSign,
  FiSliders, FiX, FiBriefcase, FiInbox,
} from "react-icons/fi";
import Header from "../components/Header";
import AdminHeader from "../components/AdminHeader";
import EmpHeader from "../components/EmpHeader";
import JsHeader from "../components/Jsheader";
import Footer from "../components/Footer";

/* "3 days ago" style label for the posted date */
const timeAgo = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted yesterday";
  if (days < 7) return `Posted ${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `Posted ${w} week${w > 1 ? "s" : ""} ago`;
  }
  return `Posted ${d.toLocaleDateString()}`;
};

/* Company logo with a lettered fallback when there is no logo or it fails to load */
function CompanyLogo({ src, name }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return <div className="jobs-logo jobs-logo-fallback" aria-hidden="true">{initial}</div>;
  }
  return (
    <img
      className="jobs-logo"
      src={src}
      alt={`${name} logo`}
      onError={() => setFailed(true)}
    />
  );
}

function Jobs() {
  const adminToken = localStorage.getItem("adminToken");
  const jsToken = localStorage.getItem("jsToken");
  const empToken = localStorage.getItem("empToken");

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedTech, setSelectedTech] = useState("");
  const [locations, setLocations] = useState([]);
  const [technologies, setTechnologies] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("jsToken");

  const getJobImageUrl = (logoPath) => {
    if (!logoPath) return null;
    return `${import.meta.env.VITE_API_URL}${logoPath}`;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/jobs`);
        const data = await response.json();
        setJobs(data);

        const uniqueLocations = [...new Set(data.map((job) => job.location).filter(Boolean))];
        setLocations(uniqueLocations);

        const techList = data.flatMap((job) => {
          if (job.technology) {
            return job.technology.split(",").map((t) => t.trim()).filter(Boolean);
          } else {
            return [(job.title || "").split(" ")[0]].filter(Boolean);
          }
        });
        setTechnologies([...new Set(techList)]);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("We couldn't load the jobs right now. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  /* Mobile filter drawer: lock page scroll, close on Escape or when resized to desktop */
  useEffect(() => {
    if (!filtersOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e) => e.key === "Escape" && setFiltersOpen(false);
    const onResize = () => window.innerWidth > 992 && setFiltersOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [filtersOpen]);

  const filteredJobs = jobs.filter((job) => {
    const matchesLocation = !selectedLocation || job.location === selectedLocation;
    const jobTechs = job.technology
      ? job.technology.split(",").map((t) => t.trim().toLowerCase())
      : [];
    const matchesTech =
      !selectedTech ||
      jobTechs.includes(selectedTech.toLowerCase()) ||
      (job.title || "").toLowerCase().includes(selectedTech.toLowerCase());

    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      [job.title, job.company, job.desc, job.technology, job.location]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(q));

    return matchesLocation && matchesTech && matchesSearch;
  });

  const activeCount = (selectedLocation ? 1 : 0) + (selectedTech ? 1 : 0) + (search.trim() ? 1 : 0);

  const clearAll = () => {
    setSearch("");
    setSelectedLocation("");
    setSelectedTech("");
  };

  return (
    <>
      {adminToken ? (<AdminHeader />) : jsToken ? (<JsHeader />) : empToken ? (<EmpHeader />) : (<Header />)}

      <div className="jobs-page">
        {/* Hero + search */}
        <section className="jobs-hero">
          <div className="jobs-hero-inner">
            <p className="jobs-hero-eyebrow">Browse opportunities</p>
            <h1 className="jobs-hero-title">Find the job that fits your next step</h1>
            <p className="jobs-hero-sub">
              {loading
                ? "Loading the latest openings…"
                : `${jobs.length} open ${jobs.length === 1 ? "role" : "roles"} across ${locations.length} ${locations.length === 1 ? "location" : "locations"}`}
            </p>

            <div className="jobs-search">
              <FiSearch className="jobs-search-icon" aria-hidden="true" />
              <input
                type="text"
                className="jobs-search-input"
                placeholder="Search by job title, company or skill"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search jobs"
              />
              {search && (
                <button
                  type="button"
                  className="jobs-search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="jobs-layout">
          {/* Backdrop for the mobile filter drawer */}
          <div
            className={`jobs-filters-backdrop ${filtersOpen ? "show" : ""}`}
            onClick={() => setFiltersOpen(false)}
          />

          {/* Filters */}
          <aside
            id="jobs-filters"
            className={`jobs-filters ${filtersOpen ? "open" : ""}`}
            aria-label="Job filters"
          >
            <div className="jobs-filters-head">
              <h2>Filters</h2>
              {activeCount > 0 && (
                <button type="button" className="jobs-filters-clear" onClick={clearAll}>
                  Clear all
                </button>
              )}
              <button
                type="button"
                className="jobs-filters-close"
                onClick={() => setFiltersOpen(false)}
                aria-label="Close filters"
              >
                <FiX />
              </button>
            </div>

            <div className="jobs-filter-group">
              <h3><FiMapPin aria-hidden="true" /> Location</h3>
              <div className="jobs-chip-list">
                <label className={`jobs-chip ${selectedLocation === "" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="location"
                    value=""
                    checked={selectedLocation === ""}
                    onChange={() => setSelectedLocation("")}
                  />
                  <span>All</span>
                </label>
                {locations.map((loc) => (
                  <label key={loc} className={`jobs-chip ${selectedLocation === loc ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="location"
                      value={loc}
                      checked={selectedLocation === loc}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                    />
                    <span>{loc}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="jobs-filter-group">
              <h3><FiBriefcase aria-hidden="true" /> Technology</h3>
              <div className="jobs-chip-list">
                <label className={`jobs-chip ${selectedTech === "" ? "active" : ""}`}>
                  <input
                    type="radio"
                    name="technology"
                    value=""
                    checked={selectedTech === ""}
                    onChange={() => setSelectedTech("")}
                  />
                  <span>All</span>
                </label>
                {technologies.map((tech) => (
                  <label key={tech} className={`jobs-chip ${selectedTech === tech ? "active" : ""}`}>
                    <input
                      type="radio"
                      name="technology"
                      value={tech}
                      checked={selectedTech === tech}
                      onChange={(e) => setSelectedTech(e.target.value)}
                    />
                    <span>{tech}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="button"
              className="jobs-filters-apply"
              onClick={() => setFiltersOpen(false)}
            >
              Show {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"}
            </button>
          </aside>

          {/* Results */}
          <main className="jobs-results">
            <div className="jobs-toolbar">
              <p className="jobs-count">
                {loading ? "Loading jobs…" : (
                  <><strong>{filteredJobs.length}</strong> {filteredJobs.length === 1 ? "job" : "jobs"} found</>
                )}
              </p>
              <button
                type="button"
                className="jobs-filter-toggle"
                onClick={() => setFiltersOpen(true)}
                aria-controls="jobs-filters"
                aria-expanded={filtersOpen}
              >
                <FiSliders aria-hidden="true" /> Filters
                {activeCount > 0 && <span className="jobs-filter-badge">{activeCount}</span>}
              </button>
            </div>

            {(selectedLocation || selectedTech) && (
              <div className="jobs-active-filters">
                {selectedLocation && (
                  <button type="button" className="jobs-active-chip" onClick={() => setSelectedLocation("")}>
                    <FiMapPin aria-hidden="true" /> {selectedLocation} <FiX aria-hidden="true" />
                    <span className="jobs-sr-only">Remove location filter</span>
                  </button>
                )}
                {selectedTech && (
                  <button type="button" className="jobs-active-chip" onClick={() => setSelectedTech("")}>
                    <FiBriefcase aria-hidden="true" /> {selectedTech} <FiX aria-hidden="true" />
                    <span className="jobs-sr-only">Remove technology filter</span>
                  </button>
                )}
              </div>
            )}

            {loading ? (
              <div className="jobs-grid" aria-hidden="true">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="jobs-skeleton">
                    <div className="jobs-skeleton-row">
                      <span className="jobs-skeleton-box logo" />
                      <span className="jobs-skeleton-lines">
                        <span className="jobs-skeleton-box line" />
                        <span className="jobs-skeleton-box line short" />
                      </span>
                    </div>
                    <span className="jobs-skeleton-box line" />
                    <span className="jobs-skeleton-box line" />
                    <span className="jobs-skeleton-box line short" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="jobs-empty">
                <FiInbox aria-hidden="true" />
                <h3>Something went wrong</h3>
                <p>{error}</p>
              </div>
            ) : filteredJobs.length > 0 ? (
              <div className="jobs-grid">
                {filteredJobs.map((job) => (
                  <article key={job._id} className="jobs-card">
                    <div className="jobs-card-top">
                      <CompanyLogo src={getJobImageUrl(job.company_logo)} name={job.company} />
                      <div className="jobs-card-heading">
                        <h3 className="jobs-card-title">{job.title}</h3>
                        <p className="jobs-card-company">{job.company}</p>
                      </div>
                    </div>

                    <div className="jobs-card-tags">
                      {job.location && (
                        <span className="jobs-tag jobs-tag-location"><FiMapPin aria-hidden="true" /> {job.location}</span>
                      )}
                      {job.type && (
                        <span className="jobs-tag jobs-tag-type"><FiClock aria-hidden="true" /> {job.type}</span>
                      )}
                      {job.positions ? (
                        <span className="jobs-tag jobs-tag-positions">
                          <FiUsers aria-hidden="true" /> {job.positions} {Number(job.positions) === 1 ? "position" : "positions"}
                        </span>
                      ) : null}
                      {job.salary && (
                        <span className="jobs-tag jobs-tag-salary"><FiDollarSign aria-hidden="true" /> {job.salary}</span>
                      )}
                    </div>

                    <p className="jobs-card-desc">{job.desc}</p>

                    <div className="jobs-card-footer">
                      <span className="jobs-card-date">{timeAgo(job.createdAt)}</span>
                      {isLoggedIn ? (
                        <button
                          type="button"
                          className="jobs-apply-btn"
                          onClick={() => navigate(`/applyjobs/${job._id}`)}
                        >
                          Apply now
                        </button>
                      ) : (
                        <Link to="/jobseekerlogin" className="jobs-login-btn">
                          Login to apply
                        </Link>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="jobs-empty">
                <FiInbox aria-hidden="true" />
                <h3>No jobs found</h3>
                <p>Try a different search or remove some filters.</p>
                {activeCount > 0 && (
                  <button type="button" className="jobs-empty-btn" onClick={clearAll}>
                    Clear filters
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Jobs;