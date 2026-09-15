/// A shell block. The highlight spans are authored inline, so the markup is
/// set rather than built from children: JSX would put the source file's own
/// indentation inside the <pre>.
export function Code({ html }: { html: string }) {
  return (
    <pre class="code">
      <code dangerouslySetInnerHTML={{ __html: html }} />
    </pre>
  );
}
