import { Helmet, HelmetData } from "react-helmet-async";

type HeadProps = {
  title?: string;
  description?: string;
};

const helmetData = new HelmetData({});

const Head = ({ title, description }: HeadProps = {}) => {
  return (
    <Helmet
      helmetData={helmetData}
      title={title ? `${title} | Futurify` : undefined}
      defaultTitle="Futurify"
    >
      <meta
        name="description"
        content={description || "Futurify - The AI-Powered Interview Tracker"}
      />
    </Helmet>
  );
};

export default Head;
