import { Schema, model, models } from "mongoose";

/**
 * A site-wide notice, shown as a banner. Used mainly for "a new course has
 * launched" so a student does not have to keep checking the academy page.
 *
 * Keyed by `key` so the same notice is not posted twice — launching a course
 * twice re-uses one announcement instead of stacking banners.
 */
export interface IAnnouncementDoc {
  key: string;
  title: string;
  body: string;
  /** Optional link target, e.g. /academy#courses. */
  href: string;
  /** The course this news is about, if any. */
  courseId?: string;
  tone: "info" | "success" | "warning";
  active: boolean;
  /** Once set, a visitor who has seen it does not see it again. */
  dismissible: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AnnouncementSchema = new Schema<IAnnouncementDoc>(
  {
    key: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, default: "", trim: true },
    href: { type: String, default: "" },
    courseId: { type: String, default: "" },
    tone: {
      type: String,
      enum: ["info", "success", "warning"],
      default: "info",
    },
    active: { type: Boolean, default: true, index: true },
    dismissible: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Announcement =
  models.Announcement || model<IAnnouncementDoc>("Announcement", AnnouncementSchema);
export default Announcement;
