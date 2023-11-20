
import { useAppSelector } from "../app/hooks";
import { BsFire, BsLightningFill } from "react-icons/bs";
import { BiCommand } from "react-icons/bi";
import { FaReadme } from "react-icons/fa6";
export const Features = () => {
    const mode = useAppSelector((state)=>{return state.mode.mode});
    return (
      <div className="px-4 py-16 mx-auto sm:max-w-xl md:max-w-full lg:max-w-screen-xl md:px-24 lg:px-8 lg:py-20 dark:text-white">
        <div className="max-w-xl mb-10 md:mx-auto sm:text-center lg:max-w-2xl md:mb-12">
          <div>
            <p className="inline-block px-3 py-px mb-4 text-xs font-semibold tracking-wider text-teal-900 uppercase rounded-full bg-teal-accent-400 dark:text-teal-400">
                Inkverse
            </p>
          </div>
          <h2 className="max-w-lg mb-6 font-sans text-3xl font-bold leading-none tracking-tight text-gray-900 sm:text-4xl md:mx-auto dark:text-gray-100">
            <span className="relative inline-block">
              <svg
                viewBox="0 0 52 24"
                fill="currentColor"
                className="absolute top-0 left-0 z-0 hidden w-32 -mt-8 -ml-20 text-blue-gray-100 lg:w-32 lg:-ml-28 lg:-mt-10 sm:block"
              >
                <defs>
                  <pattern
                    id="07690130-d013-42bc-83f4-90de7ac68f76"
                    x="0"
                    y="0"
                    width=".135"
                    height=".30"
                  >
                    <circle cx="1" cy="1" r=".7" />
                  </pattern>
                </defs>
                <rect
                  fill="url(#07690130-d013-42bc-83f4-90de7ac68f76)"
                  width="52"
                  height="24"
                />
              </svg>
              <span className="relative">The</span>
            </span>{' '}
            Your Stories, Shared. Connect, Express, Explore - One Platform
          </h2>
          <p className="text-base text-gray-700 md:text-lg dark:text-slate-400">
          Welcome to our innovative blogging and social media platform, where stories come to life. Seamlessly crafted for creators, our platform combines the art of blogging with the dynamism of social networking. 
          </p>
        </div>
        
        <div className="grid max-w-screen-lg mx-auto space-y-6 lg:grid-cols-2 lg:space-y-0 lg:divide-x">
          <div className="space-y-6 sm:px-16">
            <div className="flex flex-col max-w-md sm:flex-row">
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                <BsLightningFill fill={mode=="light"?"":"black"} />
                </div>
              </div>
              <div className="dark:text-white">
                <h6 className="mb-3 text-xl font-bold leading-5">
                SparkStream
                </h6>
                <p className="text-sm text-gray-900 dark:text-blue-200">
                Experience a stream of inspiration, creativity, and diverse content in one place.
                </p>
              </div>
            </div>
            <div className="flex flex-col max-w-md sm:flex-row">
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                    <BsFire fill={mode=="light"?"":"black"}/>
                </div>
              </div>
              <div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                StoryShowcase
                </h6>
                <p className="text-sm text-gray-900 dark:text-blue-200">
                Showcase your blogs prominently to gain more attention from readers
                </p>
              </div>
            </div>
          
          </div>
          <div className="space-y-6 sm:px-16">
            <div className="flex flex-col max-w-md sm:flex-row">
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                 <FaReadme fill={mode=="light"?"":"black"}/>
                </div>
              </div>
              <div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                Reader Insights
                </h6>
                <p className="text-sm text-gray-900 dark:text-blue-200">
                Gain insights into readership statistics to understand your audience better
                </p>
              </div>
            </div>

            <div className="flex flex-col max-w-md sm:flex-row">
              <div className="mb-4 mr-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50">
                 <BiCommand fill={mode=="light"?"":"black"}/>
                </div>
              </div>
              <div>
                <h6 className="mb-3 text-xl font-bold leading-5">
                CommentConnect
                </h6>
                <p className="text-sm text-gray-900 dark:text-blue-200">
                Engage with readers by responding to comments and building a community.
                </p>
              </div>
            </div>
            
        </div>
        </div>
        </div>
      
    );
  };