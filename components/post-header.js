import Avatar from '../components/avatar'
import DateFormatter from '../components/date-formatter'
import CoverImage from '../components/cover-image'
import PostTitle from '../components/post-title'
import { useCMS } from "tinacms";
import { InlineImage, InlineText } from 'react-tinacms-inline'

export default function PostHeader({ title, coverImage, date, author }) {
  const cms = useCMS();
  return (
    <>
      <PostTitle>
          <InlineText name="title" />
      </PostTitle>
      <div className="hidden md:block md:mb-12">
       <Avatar name={author.name} picture={process.env.STRAPI_URL + author.picture.url} />
      </div>
      <div className="mb-8 md:mb-16 sm:mx-0">
      <InlineImage name="coverImage.id" uploadDir={() => "/"} parse={(media) => media.id}>
        {() => <img src={coverImage} alt={`Cover Image for ${title}`} />}
      </InlineImage>
      </div>
      <div className="max-w-2xl mx-auto">
        <div className="block md:hidden mb-6">
        <Avatar name={author.name} picture={process.env.STRAPI_URL + author.picture.url} />
        </div>
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </>
  )
}
