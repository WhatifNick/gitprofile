import { useMemo } from 'react';
import { IoMdLink } from 'react-icons/io';
import LazyImage from '../lazy-image';
import SkillChipList from '../skill-chips';
import { Project, Skill } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';
import { createSkillLookup } from '../../utils/skills';
import ReshiftIcon from '../../assets/reshift-icon.png';
import GreenAndMeIcon from '../../assets/green-and-me-icon.png';
import CyberiskIQIcon from '../../assets/cyberiskiq-icon.png';
import NysdIcon from '../../assets/nysd-icon.png';

const images = {
  nysdIcon: NysdIcon,
  cyberiskIQIcon: CyberiskIQIcon,
  reshiftIcon: ReshiftIcon,
  greenAndMeIcon: GreenAndMeIcon,
};

const ProjectCard = ({
  title,
  loading,
  projects,
  skills = {},
}: {
  title: string;
  loading: boolean;
  projects: Project[];
  /** The skills config, so project chips can show skill details. */
  skills?: Record<string, Skill[]>;
}) => {
  const findSkill = useMemo(() => createSkillLookup(skills), [skills]);

  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < projects.length; index++) {
      array.push(
        <div className="card shadow-lg compact bg-base-100" key={index}>
          <div className="p-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              <div className="avatar mb-5 md:mb-0">
                <div className="w-24 h-24 mask mask-squircle">
                  {skeleton({
                    widthCls: 'w-full',
                    heightCls: 'h-full',
                    shape: '',
                  })}
                </div>
              </div>
              <div className="w-full">
                <div className="flex items-start px-4">
                  <div className="w-full">
                    <h3>
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-8',
                        className: 'mb-2 mx-auto md:mx-0',
                      })}
                    </h3>
                    {skeleton({
                      widthCls: 'w-24',
                      heightCls: 'h-3',
                      className: 'mx-auto md:mx-0',
                    })}
                    <div className="mt-3">
                      {skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-4',
                        className: 'mx-auto md:mx-0',
                      })}
                    </div>
                    <div className="mt-4 flex items-center flex-wrap justify-start">
                      {skeleton({
                        widthCls: 'w-32',
                        heightCls: 'h-4',
                        className: 'md:mr-2 mx-auto md:mx-0',
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  const renderProjects = () => {
    return projects.map((project, index) => {
      return (
        <div className="card shadow-lg compact bg-base-100" key={index}>
          <div className="px-4 py-4 md:px-8 h-full w-full">
            <div className="flex items-center flex-col md:flex-row">
              {project.imageUrl && (
                <div className="avatar mb-5 md:mb-0 opacity-90">
                  <div className="w-24 h-24 mask mask-squircle mr-4">
                    <LazyImage
                      src={
                        images[project.imageUrl as keyof typeof images]
                          ? images[project.imageUrl as keyof typeof images]
                          : (project.imageUrl ?? '')
                      }
                      alt=""
                      placeholder={skeleton({
                        widthCls: 'w-full',
                        heightCls: 'h-full',
                        shape: '',
                      })}
                    />
                  </div>
                </div>
              )}
              <div className="w-full">
                <div className="flex items-start">
                  <div className="text-left w-full">
                    <h3 className="font-medium text-base-content text-lg">
                      {project.title}
                    </h3>
                    <p className="text-base-content/80 text-md">
                      {project.company}
                    </p>
                    <p className="mt-1 text-base-content/90 text-sm">
                      {project.description}
                    </p>
                    <div className="p-3 flow-root">
                      <SkillChipList
                        className="-m-1"
                        leading={
                          project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noreferrer"
                              className="badge badge-neutral font-bold items-center gap-1 text-xs transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:brightness-125 focus-visible:-translate-y-0.5"
                            >
                              <IoMdLink style={{ marginTop: '1px' }} />
                              {project.link}
                              <span className="sr-only">
                                {' '}
                                (opens in a new tab)
                              </span>
                            </a>
                          )
                        }
                        items={(project.skills ?? []).map((label) => ({
                          label,
                          skill: findSkill(label),
                        }))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="col-span-1">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <div
            className={`card compact bg-base-200 ${
              loading || (projects && projects.length)
                ? 'shadow bg-opacity-40'
                : 'shadow-lg'
            }`}
          >
            <div className="card-body">
              <div className="mx-3 mb-2">
                <h2 className="card-title">
                  {loading ? (
                    skeleton({ widthCls: 'w-28', heightCls: 'h-8' })
                  ) : (
                    <span className="text-base-content">{title}</span>
                  )}
                </h2>
              </div>
              <div className="col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  {loading ? renderSkeleton() : renderProjects()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
