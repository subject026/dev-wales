const express = require("express");
const router = express.Router();

const companiesApi = require("../lib/api/companies");
const jobsApi = require("../lib/api/jobs");
const logsApi = require("../lib/api/logs");

router.get("/", (req, res) => {
  logsApi.logRequest(req);
  companiesApi.getCompanies(companies => {
    const locations = getUniqueLocations(companies);
    res.render("companies", {
      active: { companies: true },
      companies,
      locations
    });
  });
});

router.get("/:slug", (req, res) => {
  logsApi.logRequest(req);
  const slug = req.params.slug;
  companiesApi.getCompanies(companies => {
    const company = companies.find(company => {
      const companySlug = company.slug.replace("-", "");
      const comparisonSlug = slug.replace("-", "");
      return companySlug === comparisonSlug;
    });
    if (!company) {
      res.sendStatus(404);
      return;
    }
    jobsApi.getJobs(jobs => {
      const matchedJobs = jobs.filter(job => job.companyId === company.id);
      res.render("company-profile", {
        company,
        matchedJobs
      });
    });
  });
});

router.get("/add", (req, res) => {
  logsApi.logRequest(req);
  res.redirect("https://goo.gl/forms/4VviJZS8j6RArnsF2");
});

module.exports = router;

/* Utils */

function getUniqueLocations(array) {
  const locations = array.reduce((locations, item) => {
    const location = item.location;
    if (!locations.has(location)) {
      locations.add(location);
    }
    return locations;
  }, new Set());
  const sortedLocations = [...locations].sort((a, b) => {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  });
  return sortedLocations;
}
