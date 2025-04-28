export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="text-center mt-24 pt-8 border-t border-gray-100">
      <p className="mb-2">We look forward to celebrating with you!</p>
      <p className="text-sm text-gray-400">
        © {currentYear} Matt & Lauren
      </p>
    </footer>
  );
};

export default Footer;
