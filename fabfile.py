import os
from fabric import task, Connection
from invoke import run as local

# Define server details (modify as needed)
server_dir = '/home/project/live-mobile-web'
tmp_dir = '/tmp/live-mobile-web' + str(os.getpid())
ec2_user = 'ubuntu'  # Global variable for username (lowercase)


@task
def _set_user_dir(c):
    global server_dir
    with c.cd('/'):
        issue = c.run('id root', warn=True).stdout.lower()


@task
def _prepare_local_website(c, env):
    local('npm run build')
    local(f'mkdir -p {tmp_dir}')
    local('cp -rv static/ %s' % tmp_dir)


@task
def prepare_remote_dirs(c):
    _set_user_dir(c)
    if not c.run(f'test -d {server_dir}', warn=True).ok:
        c.sudo(f'mkdir -p {server_dir}')
    c.sudo(f'chmod -R 755 {server_dir}')
    c.sudo(f'chown -R {ec2_user}:{ec2_user} {server_dir}')


@task
def _clean_local_dir(c):
    local(f'rm -r {tmp_dir}')


@task
def host_type(c):
    c.run('uname -s')


@task
def deploy(c, env='test'):
    _prepare_local_website(c, env)
    prepare_remote_dirs(c)
    # Assuming upload_qiniu is a local script, not included here
    # local('qshell qupload uploadqn.json')
    # Basic rsync command
    local(f'rsync -avz -e "ssh" {tmp_dir}/ {ec2_user}@{c.host}:{server_dir}')
    _clean_local_dir(c)
