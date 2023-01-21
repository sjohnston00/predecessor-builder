import React from "react";
import { ActionArgs, redirect } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";
import { Form, Link, useLoaderData, useTransition } from "@remix-run/react";
import { prisma } from "~/utils/prisma.server";
import Textarea from "~/components/Textarea";
import Button from "~/components/Button";
import { getUserId, requireUserId } from "~/utils/session.server";
import Heading from "~/components/Heading";
import LinkButton from "~/components/LinkButton";

export const loader = async ({ params, request }: LoaderArgs) => {
  const buildName = params.buildName;
  const loggedInUserId = await getUserId(request);

  if (!buildName) throw redirect("/builds/");

  const build = await prisma.build.findFirst({
    where: {
      name: buildName
    },
    include: {
      hero: true,
      user: true,
      comments: {
        include: {
          user: true
        }
      },
      likes: {
        include: {
          user: true
        }
      }
    }
  });

  if (!build)
    throw new Response(`Couldn't find a build under the name ${buildName}`);

  const loggedInUserHasBuildLike = await prisma.like.findFirst({
    where: {
      userId: loggedInUserId || ""
    }
  });
  const isLoggedInUsersBuild = build?.userId === loggedInUserId;

  if (!build) throw redirect("/builds/");

  return { loggedInUserHasBuildLike, isLoggedInUsersBuild, build };
};

export const action = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);
  const loggedInUserId = await requireUserId(request);

  if (data._action === "like") {
    //If we already like it, remove the like
    if (data.loggedInUserHasBuildLike) {
      await prisma.like.delete({
        where: {
          likeId: data.loggedInUserHasBuildLike.toString()
        }
      });
      return null;
    }
    //Else we haven't liked it, create a like
    await prisma.like.create({
      data: {
        userId: loggedInUserId,
        buildId: data.buildId.toString()
      }
    });
    return null;
  }

  if (data._action === "comment") {
    await prisma.comment.create({
      data: {
        userId: loggedInUserId,
        buildId: data.buildId.toString(),
        content: data.comment.toString()
      }
    });
    return null;
  }

  return data;
};

export default function BuildNumber() {
  const { build, isLoggedInUsersBuild, loggedInUserHasBuildLike } =
    useLoaderData<typeof loader>();
  const { state } = useTransition();
  const isSubmitting = state === "submitting";
  return (
    <div className='px-1'>
      <p>Hero: {build.hero.name}</p>
      <p>
        By: {build.user?.username ? `${build.user?.username}` : "Anonymous"}
      </p>
      <p>Likes: [{build.likes.length}]</p>
      <Heading type='h2'>Comments: [{build.comments.length}]</Heading>
      {build.comments.map((comment) => (
        <p key={comment.commentId}>
          {comment.content} - {comment.user.username}
        </p>
      ))}

      <p>Skill Order: [{build.abilityOrder.toLocaleString()}]</p>
      {isLoggedInUsersBuild ? (
        <LinkButton to={`/builds/${build.hero.name}/${build.name}/edit`}>
          Edit
        </LinkButton>
      ) : null}
      <Form method='post'>
        <input type='hidden' name='_action' id='_action' value='like' />
        <input
          type='hidden'
          name='loggedInUserHasBuildLike'
          id='loggedInUserHasBuildLike'
          value={loggedInUserHasBuildLike?.likeId}
        />
        <input
          type='hidden'
          name='buildId'
          id='buildId'
          value={build.buildId}
        />
        <Button type='submit' disabled={isSubmitting} className='bg-teal-500'>
          {loggedInUserHasBuildLike ? "Unlike" : "Like"}
        </Button>
      </Form>
      <Form method='post'>
        <input type='hidden' name='_action' id='_action' value='comment' />
        <input
          type='hidden'
          name='buildId'
          id='buildId'
          value={build.buildId}
        />
        <Textarea name='comment' id='comment' required />
        <Button type='submit' disabled={isSubmitting}>
          Comment
        </Button>
      </Form>
    </div>
  );
}
