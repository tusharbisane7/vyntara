import React from 'react';
import {
  MapPin,
  BriefcaseBusiness,
  ArrowUpRight,
  Clock3,
  Sparkles
} from 'lucide-react';
import './JobCard.css';

const JobCard = ({ job, onApply }) => {
  if (!job) return null;

  const {
    position_name,
    location,
    employment_type,
    short_description,
    tags = [],
    created_at
  } = job;

  const formattedDate = created_at
    ? new Date(created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    : null;

  return (
    <article className="job-card">
      {/* Top glow */}
      <div className="job-card-glow" />

      {/* Card Header */}
      <div className="job-card-header">
        <div className="job-card-icon">
          <BriefcaseBusiness size={22} />
        </div>

        <div className="job-card-date">
          {formattedDate && (
            <>
              <Clock3 size={13} />
              <span>{formattedDate}</span>
            </>
          )}
        </div>
      </div>

      {/* Position */}
      <div className="job-card-content">
        <div className="job-card-label">
          <Sparkles size={13} />
          <span>WE'RE HIRING</span>
        </div>

        <h3 className="job-card-title">
          {position_name}
        </h3>

        {/* Job Info */}
        <div className="job-card-meta">
          <div className="job-meta-item">
            <MapPin size={16} />
            <span>{location}</span>
          </div>

          <div className="job-meta-item">
            <BriefcaseBusiness size={16} />
            <span>{employment_type}</span>
          </div>
        </div>

        {/* Description */}
        <p className="job-card-description">
          {short_description}
        </p>

        {/* Tags */}
        {Array.isArray(tags) && tags.length > 0 && (
          <div className="job-card-tags">
            {tags.map((tag, index) => (
              <span className="job-tag" key={`${tag}-${index}`}>
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="job-card-footer">
        <button
          type="button"
          className="job-apply-button"
          onClick={() => onApply(job)}
        >
          <span>Apply Now</span>

          <span className="job-apply-icon">
            <ArrowUpRight size={18} />
          </span>
        </button>
      </div>
    </article>
  );
};

export default JobCard;