export default function If({ children, condition = false }) {
  return condition ? <>{children}</> : null;
}
