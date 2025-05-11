export default function Button({ children, onClick }) {
    return (
      <button
        onClick={onClick}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
      >
        {children}
      </button>
    );
  }
// This code defines a functional React component named `Button`.
// The component accepts two props: `children` and `onClick`.
// - `children`: This prop represents the content that will be displayed inside the button.
// - `onClick`: This prop is a function that will be called when the button is clicked.  