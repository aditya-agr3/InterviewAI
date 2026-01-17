const companies = [
  {
    name: 'Google',
    textClass: 'bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text',
  },
  {
    name: 'Meta',
    textClass: 'bg-gradient-to-r from-blue-600 to-sky-500 text-transparent bg-clip-text',
  },
  {
    name: 'Microsoft',
    textClass: 'bg-gradient-to-r from-emerald-500 to-teal-500 text-transparent bg-clip-text',
  },
  {
    name: 'Amazon',
    textClass: 'bg-gradient-to-r from-amber-500 to-orange-500 text-transparent bg-clip-text',
  },
  {
    name: 'Deloitte',
    textClass: 'bg-gradient-to-r from-indigo-500 to-purple-500 text-transparent bg-clip-text',
  },
  {
    name: 'McKinsey & Company',
    textClass: 'bg-gradient-to-r from-slate-600 to-slate-900 text-transparent bg-clip-text',
  },
  {
    name: 'Goldman Sachs',
    textClass: 'bg-gradient-to-r from-yellow-600 to-amber-500 text-transparent bg-clip-text',
  },
  {
    name: 'Netflix',
    textClass: 'bg-gradient-to-r from-rose-500 to-red-600 text-transparent bg-clip-text',
  },
  {
    name: 'Stripe',
    textClass: 'bg-gradient-to-r from-violet-500 to-indigo-500 text-transparent bg-clip-text',
  },
  {
    name: 'Airbnb',
    textClass: 'bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text',
  },
];

const CompanyMarquee = () => {
  return (
    <section className="card bg-gradient-to-r from-purple-50 via-indigo-50 to-purple-50 border border-purple-100 overflow-hidden">
      <div className="flex flex-col gap-2 mb-6">
        <p className="text-xs uppercase tracking-[0.3em] text-text-muted">
          Trusted by ambitious candidates
        </p>
        <h3 className="text-xl font-semibold text-text-heading">
          Get interview-ready for top global teams
        </h3>
      </div>

      <div className="marquee-mask">
        <div className="marquee-track">
          <div className="marquee-group">
            {companies.map((company) => (
              <span
                key={`company-${company.name}`}
                className="px-5 py-2 rounded-full bg-white/80 shadow-card border border-white/70 text-base font-semibold tracking-tight whitespace-nowrap"
              >
                <span className={company.textClass}>{company.name}</span>
              </span>
            ))}
          </div>
          <div className="marquee-group" aria-hidden="true">
            {companies.map((company) => (
              <span
                key={`company-duplicate-${company.name}`}
                className="px-5 py-2 rounded-full bg-white/80 shadow-card border border-white/70 text-base font-semibold tracking-tight whitespace-nowrap"
              >
                <span className={company.textClass}>{company.name}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanyMarquee;
