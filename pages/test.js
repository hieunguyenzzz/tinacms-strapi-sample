import Layout from "../components/layout";
import { useCMS, useForm, usePlugin } from "tinacms";
import { fetchGraphql } from 'react-tinacms-strapi'

export default function Test({pageData}) {
    const cms = useCMS();
    console.log(pageData);
    const formConfig = {
        id: "testpage",
        label: 'Blog Post',
        initialValues: pageData,
        onSubmit: async (values) => {
            const saveMutation = `
            mutation updateTestPage(
                $title: String, $data: JSON            
            ) {
                updateTestpage(input: {data: {title: $title, data: $data}}) {
                    testpage {
                        data
                    }
                }    
            }`;
            const response = await cms.api.strapi.fetchGraphql(
                saveMutation,
                {            
                    title: values.title,       
                    data: JSON.stringify(values),                
                }
            );
            if (response.data) {
                cms.alerts.success("Changes Saved");
            } else {
                cms.alerts.error("Error saving changes");
            }
        },
        fields: [
            {
                component: 'text',
                name: 'title',
                label: 'Title',
                description: 'Enter the title of the post here',
                placeholder: '...',
            },
            {
                label: 'Contact Info',
                name: 'rawJson.contact',
                description: 'Contact info',
                component: 'group',
                fields: [
                  {
                    label: 'Email',
                    name: 'email',
                    description: 'Contact email',
                    component: 'text',
                  },
                  {
                    label: 'Twitter',
                    name: 'twitter_handle',
                    description: 'Twitter handle',
                    component: 'text',
                  },
                  {
                    label: 'Github',
                    name: 'github_handle',
                    description: 'Github username',
                    component: 'text',
                  },
                ],
            },
            {
                label: 'Authors List',
                name: 'rawJson.authors',
                component: 'group-list',
                description: 'Authors List',
                itemProps: item => ({
                  key: item.id,
                  label: item.name,
                }),
                defaultItem: () => ({
                  name: 'New Author',
                  id: Math.random()
                    .toString(36)
                    .substr(2, 9),
                }),
                fields: [
                  {
                    label: 'Name',
                    name: 'name',
                    component: 'text',
                  },
                  {
                    label: 'Best Novel',
                    name: 'best-novel',
                    component: 'text',
                  },
                  {
                    label: 'Hero Image',
                    name: 'hero_image',
                    component: 'image',
                    // Generate the frontmatter value based on the filename
                    parse: media => process.env.STRAPI_URL + '/uploads/' +media.filename,
              
                    // Decide the file upload directory for the post
                    uploadDir: () => '/',
              
                    // Generate the src attribute for the preview image.
                    previewSrc: fullSrc => {
                        return fullSrc;
                    },
                  },
                ],
              },
        ],
    }
    const [post, form] = useForm(formConfig)
    usePlugin(form);
    console.log('post');
    console.log(post);
    return <Layout>
        {post.rawJson.authors.map( author => 
        <li>
            {author.name}
            <img src={author.hero_image} />
        </li>) }
    </Layout>;
}

export async function getStaticProps({ params, preview, previewData }) {
    const postResults = await fetchGraphql(
        process.env.STRAPI_URL,
        `
        query{
            testpage {
                data
            }
        }
      `
      );
      
      const pageData = JSON.parse(postResults.data.testpage.data);
      return {
        props: {
            pageData
        },
      }
}

