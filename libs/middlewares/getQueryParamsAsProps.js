export default async function getQueryParamsAsProps(context, props) {
  return { props: { ...props, ...context.query } }
}