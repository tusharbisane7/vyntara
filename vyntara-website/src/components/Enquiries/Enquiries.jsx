import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Filter,
  Eye,
  Trash2,
  X,
  Mail,
  Phone,
  Building2,
  CalendarDays,
  Clock3,
  Wallet,
  FolderKanban,
  MessageSquare,
  ChevronDown,
  RefreshCw,
  Inbox,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

import {
  getProjects,
  updateProjectStatus,
  deleteProject
} from '../../services/api';

import './Enquiries.css';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Enquiries' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const STATUS_LABELS = {
  new: 'New',
  contacted: 'Contacted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled'
};

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [actionLoading, setActionLoading] = useState(null);

  const [error, setError] = useState('');

  /*
  |--------------------------------------------------------------------------
  | LOAD ENQUIRIES
  |--------------------------------------------------------------------------
  */

  const loadEnquiries = async (showRefresh = false) => {
    try {
      setError('');

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getProjects();

      /*
       * Supports either:
       *   data.projects
       * or
       *   data
       */

      const projects = Array.isArray(data)
        ? data
        : data?.projects || [];

      setEnquiries(projects);

    } catch (err) {
      console.error('Unable to load enquiries:', err);

      setError(
        err.message ||
        'Unable to load enquiries.'
      );

    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER ENQUIRIES
  |--------------------------------------------------------------------------
  */

  const filteredEnquiries = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return enquiries.filter((enquiry) => {
      const matchesStatus =
        statusFilter === 'all' ||
        enquiry.status === statusFilter;

      if (!query) {
        return matchesStatus;
      }

      const searchableText = [
        enquiry.full_name,
        enquiry.email,
        enquiry.phone,
        enquiry.company,
        enquiry.project_type,
        enquiry.budget,
        enquiry.timeline,
        enquiry.project_description
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return (
        matchesStatus &&
        searchableText.includes(query)
      );
    });
  }, [
    enquiries,
    searchTerm,
    statusFilter
  ]);

  /*
  |--------------------------------------------------------------------------
  | STATUS COUNTS
  |--------------------------------------------------------------------------
  */

  const statusCounts = useMemo(() => {
    return {
      total: enquiries.length,

      new: enquiries.filter(
        (item) => item.status === 'new'
      ).length,

      contacted: enquiries.filter(
        (item) => item.status === 'contacted'
      ).length,

      inProgress: enquiries.filter(
        (item) => item.status === 'in_progress'
      ).length,

      completed: enquiries.filter(
        (item) => item.status === 'completed'
      ).length
    };
  }, [enquiries]);

  /*
  |--------------------------------------------------------------------------
  | FORMAT DATE
  |--------------------------------------------------------------------------
  */

  const formatDate = (dateValue) => {
    if (!dateValue) {
      return '—';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '—';
    }

    return date.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | FORMAT TIME
  |--------------------------------------------------------------------------
  */

  const formatTime = (dateValue) => {
    if (!dateValue) {
      return '';
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    enquiry,
    newStatus
  ) => {
    if (!enquiry?.id) {
      return;
    }

    if (enquiry.status === newStatus) {
      return;
    }

    try {
      setActionLoading(
        `status-${enquiry.id}`
      );

      setError('');

      await updateProjectStatus(
        enquiry.id,
        newStatus
      );

      setEnquiries((previous) =>
        previous.map((item) =>
          item.id === enquiry.id
            ? {
                ...item,
                status: newStatus
              }
            : item
        )
      );

      setSelectedEnquiry((previous) =>
        previous?.id === enquiry.id
          ? {
              ...previous,
              status: newStatus
            }
          : previous
      );

    } catch (err) {
      console.error(
        'Status update error:',
        err
      );

      setError(
        err.message ||
        'Unable to update enquiry status.'
      );

    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE ENQUIRY
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (enquiry) => {
    if (!enquiry?.id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the enquiry from ${
        enquiry.full_name || 'this client'
      }? This action cannot be undone.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(
        `delete-${enquiry.id}`
      );

      setError('');

      await deleteProject(enquiry.id);

      setEnquiries((previous) =>
        previous.filter(
          (item) => item.id !== enquiry.id
        )
      );

      if (
        selectedEnquiry?.id === enquiry.id
      ) {
        setSelectedEnquiry(null);
      }

    } catch (err) {
      console.error(
        'Delete enquiry error:',
        err
      );

      setError(
        err.message ||
        'Unable to delete enquiry.'
      );

    } finally {
      setActionLoading(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | STATUS CLASS
  |--------------------------------------------------------------------------
  */

  const getStatusClass = (status) => {
    switch (status) {
      case 'new':
        return 'status-new';

      case 'contacted':
        return 'status-contacted';

      case 'in_progress':
        return 'status-progress';

      case 'completed':
        return 'status-completed';

      case 'cancelled':
        return 'status-cancelled';

      default:
        return 'status-new';
    }
  };

  /*
  |--------------------------------------------------------------------------
  | LOADING STATE
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <section className="enquiries-page">
        <div className="enquiries-loading">
          <div className="enquiries-spinner">
            <RefreshCw size={24} />
          </div>

          <h3>Loading enquiries</h3>

          <p>
            Fetching project requests from the
            database...
          </p>
        </div>
      </section>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <section className="enquiries-page">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="enquiries-header">

        <div>
          <span className="enquiries-eyebrow">
            CLIENT MANAGEMENT
          </span>

          <h1>
            Project Enquiries
          </h1>

          <p>
            Manage and track project requests
            submitted through the Vyntara website.
          </p>
        </div>

        <button
          type="button"
          className="enquiries-refresh"
          onClick={() => loadEnquiries(true)}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? 'is-spinning'
                : ''
            }
          />

          <span>
            {refreshing
              ? 'Refreshing...'
              : 'Refresh'}
          </span>
        </button>

      </div>

      {/* =========================================================
          ERROR
      ========================================================= */}

      {error && (
        <div className="enquiries-error">
          <AlertCircle size={18} />

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError('')}
            aria-label="Close error"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* =========================================================
          STAT CARDS
      ========================================================= */}

      <div className="enquiries-stats">

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon">
            <Inbox size={20} />
          </div>

          <div>
            <span>Total Enquiries</span>
            <strong>
              {statusCounts.total}
            </strong>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon">
            <AlertCircle size={20} />
          </div>

          <div>
            <span>New</span>
            <strong>
              {statusCounts.new}
            </strong>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon">
            <Clock3 size={20} />
          </div>

          <div>
            <span>In Progress</span>
            <strong>
              {statusCounts.inProgress}
            </strong>
          </div>
        </div>

        <div className="enquiry-stat-card">
          <div className="enquiry-stat-icon">
            <CheckCircle2 size={20} />
          </div>

          <div>
            <span>Completed</span>
            <strong>
              {statusCounts.completed}
            </strong>
          </div>
        </div>

      </div>

      {/* =========================================================
          FILTER BAR
      ========================================================= */}

      <div className="enquiries-toolbar">

        <div className="enquiries-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search enquiries..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() =>
                setSearchTerm('')
              }
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="enquiries-filter">

          <Filter size={17} />

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(
                event.target.value
              )
            }
          >
            {STATUS_OPTIONS.map(
              (option) => (
                <option
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </option>
              )
            )}
          </select>

          <ChevronDown size={15} />
        </div>

      </div>

      {/* =========================================================
          RESULT INFO
      ========================================================= */}

      <div className="enquiries-result-info">
        <span>
          Showing{' '}
          <strong>
            {filteredEnquiries.length}
          </strong>{' '}
          of{' '}
          <strong>
            {enquiries.length}
          </strong>{' '}
          enquiries
        </span>
      </div>

      {/* =========================================================
          TABLE
      ========================================================= */}

      <div className="enquiries-table-card">

        {filteredEnquiries.length === 0 ? (

          <div className="enquiries-empty">

            <div className="enquiries-empty-icon">
              <Inbox size={30} />
            </div>

            <h3>
              No enquiries found
            </h3>

            <p>
              {enquiries.length === 0
                ? 'Project requests submitted through the website will appear here.'
                : 'Try changing your search or status filter.'}
            </p>

            {(searchTerm ||
              statusFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </button>
            )}

          </div>

        ) : (

          <div className="enquiries-table-wrapper">

            <table className="enquiries-table">

              <thead>
                <tr>
                  <th>CLIENT</th>
                  <th>PROJECT</th>
                  <th>BUDGET</th>
                  <th>SUBMITTED</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>

                {filteredEnquiries.map(
                  (enquiry) => (

                    <tr key={enquiry.id}>

                      {/* CLIENT */}

                      <td>
                        <div className="enquiry-client">

                          <div className="enquiry-avatar">
                            {(
                              enquiry.full_name ||
                              'C'
                            )
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {enquiry.full_name ||
                                'Unknown Client'}
                            </strong>

                            <span>
                              {enquiry.email ||
                                'No email'}
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* PROJECT */}

                      <td>
                        <div className="enquiry-project">

                          <strong>
                            {enquiry.project_type ||
                              'Project'}
                          </strong>

                          {enquiry.company && (
                            <span>
                              {enquiry.company}
                            </span>
                          )}

                        </div>
                      </td>

                      {/* BUDGET */}

                      <td>
                        <span className="enquiry-budget">
                          {enquiry.budget ||
                            'Not specified'}
                        </span>
                      </td>

                      {/* DATE */}

                      <td>
                        <div className="enquiry-date">

                          <span>
                            {formatDate(
                              enquiry.created_at
                            )}
                          </span>

                          <small>
                            {formatTime(
                              enquiry.created_at
                            )}
                          </small>

                        </div>
                      </td>

                      {/* STATUS */}

                      <td>

                        <div className="enquiry-status-control">

                          <span
                            className={`enquiry-status ${getStatusClass(
                              enquiry.status
                            )}`}
                          >
                            {STATUS_LABELS[
                              enquiry.status
                            ] ||
                              enquiry.status ||
                              'New'}
                          </span>

                          <select
                            value={
                              enquiry.status ||
                              'new'
                            }
                            onChange={(event) =>
                              handleStatusChange(
                                enquiry,
                                event.target.value
                              )
                            }
                            disabled={
                              actionLoading ===
                              `status-${enquiry.id}`
                            }
                            aria-label="Change enquiry status"
                          >
                            {STATUS_OPTIONS
                              .filter(
                                (option) =>
                                  option.value !==
                                  'all'
                              )
                              .map(
                                (option) => (
                                  <option
                                    key={
                                      option.value
                                    }
                                    value={
                                      option.value
                                    }
                                  >
                                    {option.label}
                                  </option>
                                )
                              )}
                          </select>

                        </div>

                      </td>

                      {/* ACTION */}

                      <td>

                        <div className="enquiry-actions">

                          <button
                            type="button"
                            className="enquiry-view-button"
                            onClick={() =>
                              setSelectedEnquiry(
                                enquiry
                              )
                            }
                            title="View enquiry"
                          >
                            <Eye size={17} />
                          </button>

                          <button
                            type="button"
                            className="enquiry-delete-button"
                            onClick={() =>
                              handleDelete(
                                enquiry
                              )
                            }
                            disabled={
                              actionLoading ===
                              `delete-${enquiry.id}`
                            }
                            title="Delete enquiry"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* =========================================================
          DETAIL MODAL
      ========================================================= */}

      {selectedEnquiry && (

        <div
          className="enquiry-modal-overlay"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setSelectedEnquiry(null);
            }
          }}
        >

          <div className="enquiry-modal">

            {/* MODAL HEADER */}

            <div className="enquiry-modal-header">

              <div>

                <span className="enquiries-eyebrow">
                  PROJECT ENQUIRY
                </span>

                <h2>
                  {selectedEnquiry.full_name ||
                    'Client Enquiry'}
                </h2>

              </div>

              <button
                type="button"
                className="enquiry-modal-close"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
                aria-label="Close enquiry"
              >
                <X size={20} />
              </button>

            </div>

            {/* CLIENT DETAILS */}

            <div className="enquiry-detail-grid">

              <div className="enquiry-detail">

                <Mail size={17} />

                <div>
                  <span>Email</span>

                  <a
                    href={`mailto:${
                      selectedEnquiry.email || ''
                    }`}
                  >
                    {selectedEnquiry.email ||
                      'Not provided'}
                  </a>
                </div>

              </div>

              <div className="enquiry-detail">

                <Phone size={17} />

                <div>
                  <span>Phone</span>

                  {selectedEnquiry.phone ? (
                    <a
                      href={`tel:${selectedEnquiry.phone}`}
                    >
                      {selectedEnquiry.phone}
                    </a>
                  ) : (
                    <strong>
                      Not provided
                    </strong>
                  )}
                </div>

              </div>

              <div className="enquiry-detail">

                <Building2 size={17} />

                <div>
                  <span>Company</span>

                  <strong>
                    {selectedEnquiry.company ||
                      'Not provided'}
                  </strong>
                </div>

              </div>

              <div className="enquiry-detail">

                <FolderKanban size={17} />

                <div>
                  <span>Project Type</span>

                  <strong>
                    {selectedEnquiry.project_type ||
                      'Not specified'}
                  </strong>
                </div>

              </div>

              <div className="enquiry-detail">

                <Wallet size={17} />

                <div>
                  <span>Estimated Budget</span>

                  <strong>
                    {selectedEnquiry.budget ||
                      'Not specified'}
                  </strong>
                </div>

              </div>

              <div className="enquiry-detail">

                <CalendarDays size={17} />

                <div>
                  <span>Expected Timeline</span>

                  <strong>
                    {selectedEnquiry.timeline ||
                      'Not specified'}
                  </strong>
                </div>

              </div>

            </div>

            {/* SUBMISSION */}

            <div className="enquiry-submission-info">

              <CalendarDays size={16} />

              <span>
                Submitted{' '}
                <strong>
                  {formatDate(
                    selectedEnquiry.created_at
                  )}
                </strong>{' '}
                at{' '}
                <strong>
                  {formatTime(
                    selectedEnquiry.created_at
                  )}
                </strong>
              </span>

            </div>

            {/* STATUS */}

            <div className="enquiry-modal-status">

              <div>
                <span>
                  Current Status
                </span>

                <strong
                  className={`enquiry-status ${getStatusClass(
                    selectedEnquiry.status
                  )}`}
                >
                  {STATUS_LABELS[
                    selectedEnquiry.status
                  ] ||
                    selectedEnquiry.status ||
                    'New'}
                </strong>
              </div>

              <div className="enquiry-modal-status-select">

                <select
                  value={
                    selectedEnquiry.status ||
                    'new'
                  }
                  onChange={(event) =>
                    handleStatusChange(
                      selectedEnquiry,
                      event.target.value
                    )
                  }
                  disabled={
                    actionLoading ===
                    `status-${selectedEnquiry.id}`
                  }
                >
                  {STATUS_OPTIONS
                    .filter(
                      (option) =>
                        option.value !==
                        'all'
                    )
                    .map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                </select>

              </div>

            </div>

            {/* MESSAGE */}

            <div className="enquiry-message">

              <div className="enquiry-message-title">

                <MessageSquare size={17} />

                <span>
                  Project Description
                </span>

              </div>

              <div className="enquiry-message-content">

                {selectedEnquiry.project_description ||
                  'No project description provided.'}

              </div>

            </div>

            {/* MODAL ACTIONS */}

            <div className="enquiry-modal-actions">

              <button
                type="button"
                className="enquiry-modal-secondary"
                onClick={() =>
                  setSelectedEnquiry(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="enquiry-modal-danger"
                onClick={() =>
                  handleDelete(
                    selectedEnquiry
                  )
                }
                disabled={
                  actionLoading ===
                  `delete-${selectedEnquiry.id}`
                }
              >
                <Trash2 size={16} />

                {actionLoading ===
                `delete-${selectedEnquiry.id}`
                  ? 'Deleting...'
                  : 'Delete Enquiry'}
              </button>

            </div>

          </div>

        </div>

      )}

    </section>
  );
}

export default Enquiries;