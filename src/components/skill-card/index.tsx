import { Skill } from '../../interfaces/sanitized-config';
import { skeleton } from '../../utils';

const SkillCard = ({
  loading,
  skills,
}: {
  loading: boolean;
  skills: Record<string, Skill[]>;
}) => {
  const renderSkeleton = () => {
    const array = [];
    for (let index = 0; index < 8; index++) {
      array.push(
        <div className="card shadow-lg compact bg-base-100 w-full" key={index}>
          <div className="flex items-start px-4 py-4 md:px-8 h-full w-full">
            <div className="text-left ">
              <h3 className="font-medium text-base-content text-lg">
                {skeleton({
                  widthCls: 'w-32',
                  heightCls: 'h-6',
                })}
              </h3>
              <div className="mt-2 flex items-center flex-wrap justify-start">
                {Array.from({ length: Math.floor(Math.random() * 10) + 2 }).map(
                  () =>
                    skeleton({
                      widthCls: 'w-16',
                      heightCls: 'h-4',
                      className: 'm-1',
                    }),
                )}
              </div>
            </div>
          </div>
        </div>,
      );
    }

    return array;
  };

  return (
    <div className="col-span-1">
      <div className="grid grid-cols-2 gap-6">
        <div className="col-span-2">
          <div className="card shadow-lg compact bg-base-200">
            <div className="card-body">
              <div className="mx-3">
                <h2 className="card-title">
                  {loading ? (
                    skeleton({ widthCls: 'w-32', heightCls: 'h-8' })
                  ) : (
                    <span className="text-base-content">Skills</span>
                  )}
                </h2>
              </div>

              <div className="col-span-2">
                <div className="grid grid-cols-1 gap-6">
                  {loading
                    ? renderSkeleton()
                    : Object.keys(skills).map((skillType, index) => (
                        <div
                          className="card shadow-lg compact bg-base-100 w-full"
                          key={index}
                        >
                          <div className="flex items-start px-4 py-4 md:px-8 h-full w-full">
                            <div className="text-left ">
                              <h3 className="font-medium text-base-content text-lg">
                                {skillType.charAt(0).toUpperCase() +
                                  skillType.slice(1)}
                              </h3>
                              <div className="p-3 flow-root">
                                <div className="-m-1 flex flex-wrap justify-start gap-2">
                                  {skills[skillType].map((skill, index2) => (
                                    <div
                                      className="badge badge-primary font-bold text-xs"
                                      key={index2}
                                    >
                                      {skill.title}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkillCard;
