export default function Button({
  children,
  className = '',
  disabled = false,
  type = 'button',
  variant = 'primary',
  ...props
}) {
  return (
    <button
      className={`button button--${variant} ${className}`.trim()}
      disabled={disabled}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
