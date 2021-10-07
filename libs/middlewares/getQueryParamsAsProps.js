export default async function getQueryParamsAsProps(context, props) {
  return { props: { ...props, id: context.query.id, viewKey: context.query.view_key } }
}